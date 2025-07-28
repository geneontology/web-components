import {
  Component,
  Event,
  EventEmitter,
  Fragment,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import clsx from "clsx";

import { groupKey, cellKey, truncate, getNbAnnotations } from "./utils";

import {
  ColorByOption,
  RibbonCategory,
  RibbonCellEvent,
  RibbonGroup,
  RibbonGroupEvent,
  RibbonData,
  RibbonSubject,
  SelectionModeOption,
  SubjectPositionOption,
} from "../../globals/models";
import { sameArray } from "../../globals/utils";
import { getRibbonSummary } from "../../globals/api";

const GROUP_ALL: RibbonGroup = {
  id: "all",
  label: "all annotations",
  description: "Show all annotations for all categories",
  type: "GlobalAll",
};

/**
 * The Annotation Ribbon Strips component displays a grid of cells. Each row in the grid represents
 * a subject (typically a gene), and each column represents a GO term. The color of each cell
 * indicates the relative number of GO annotations for that subject to the term or one of its
 * descendants in the ontology hierarchy. The columns are additionally grouped into categories
 * which are visually separated in the display.
 *
 * Events are fired when cells or cell headers (groups) are clicked or hovered over.
 */
@Component({
  tag: "go-annotation-ribbon-strips",
  styleUrl: "annotation-ribbon-strips.scss",
  shadow: true,
})
export class AnnotationRibbonStrips {
  private dataManuallySet: boolean = false;

  @State() selectedGroup: RibbonGroup | null = null;
  @State() selectedSubjects: RibbonSubject[] = [];
  @State() hoveredGroup: RibbonGroup | null = null;
  @State() hoveredSubjects: RibbonSubject[] = [];

  @State() loading: boolean = false;
  @State() loadingError: boolean = false;
  @State() data?: RibbonData;

  /**
   * Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)
   */
  @Prop() subjects?: string;

  /**
   * Name of the GO subset used for grouping annotations.
   */
  @Prop() subset: string = "goslim_agr";

  /**
   * URL for the API endpoint to fetch the ribbon data when subjects are provided.
   */
  @Prop() apiEndpoint = "https://api.geneontology.org/api/ontology/ribbon/";

  /**
   * Base URL used when rendering subject label links.
   */
  @Prop() subjectBaseUrl: string =
    "https://amigo.geneontology.org/amigo/gene_product/";

  /**
   * Labels used with class counts.
   */
  @Prop() classLabels = "term,terms";

  /**
   * Labels used with annotation counts.
   */
  @Prop() annotationLabels = "annotation,annotations";

  /**
   * Whether to color cells by annotations or classes.
   */
  @Prop() colorBy: ColorByOption = "annotations";

  /**
   * If `true`, show only two colors (`minColor` and `maxColor`) to indicate the values of a cell.
   * Otherwise, the color of a cell will be interpolated between `minColor` and `maxColor` based on
   * the number of annotations or classes.
   */
  @Prop() binaryColor = false;

  /**
   * Color of cells with the least number of annotations or classes.
   */
  @Prop() minColor = "255,255,255";

  /**
   * Color of cells with the most number of annotations or classes.
   */
  @Prop() maxColor = "24,73,180";

  /**
   * Maximum number of annotations or classes before `maxColor` is applied.
   */
  @Prop() maxHeatLevel = 48;

  /**
   * Maximum size of group labels in characters.
   */
  @Prop() groupMaxLabelSize = 60;

  /**
   * If `true`, show the "Other" group for each category.
   */
  @Prop() showOtherGroup = false;

  /**
   * If `true`, show the "all annotations" group.
   */
  @Prop() showAllAnnotationsGroup: boolean = true;

  /**
   * Position subject labels.
   */
  @Prop() subjectPosition: SubjectPositionOption = "left";

  /**
   * If `true`, clicking a subject label will open the link in a new tab.
   */
  @Prop() subjectOpenNewTab: boolean = true;

  /**
   * If `true`, the group labels are clickable and will trigger the `groupClick` event
   */
  @Prop() groupClickable: boolean = true;

  /**
   * Selection mode for the ribbon cells.
   */
  @Prop() selectionMode: SelectionModeOption = "cell";

  /**
   * If no value is provided, the ribbon will load without any group selected.
   * If a value is provided, the ribbon will show the requested group as selected
   * The value should be the id of the group to be selected
   */
  @Prop() selected?: string;
  @Watch("selected")
  selectedChanged() {
    if (this.selected) {
      if (this.selected === GROUP_ALL.id) {
        this.selectedGroup = GROUP_ALL;
      } else {
        this.selectedGroup =
          this.data?.categories
            .flatMap((cat) => cat.groups)
            .find((group) => group.id === this.selected) || null;
      }
      this.selectedSubjects = this.data?.subjects || [];
    } else {
      this.selectedGroup = null;
      this.selectedSubjects = [];
    }
  }

  /**
   * When one of the props that affect data fetching changes, refetch the data.
   */
  @Watch("subjects")
  @Watch("subset")
  @Watch("apiEndpoint")
  refetchData() {
    if (this.dataManuallySet) {
      // If data was manually set, do not fetch again
      return;
    }
    if (!this.subjects) {
      // If no subjects are provided, reset selection state and clear data
      this.selectedGroup = null;
      this.selectedSubjects = [];
      this.data = undefined;
      return;
    }
    return this.fetchData();
  }

  /**
   * Emitted when a ribbon cell is clicked.
   */
  @Event({ eventName: "cellClick", cancelable: true, bubbles: true })
  cellClick: EventEmitter<RibbonCellEvent>;

  /**
   * Emitted when the mouse enters a ribbon cell.
   */
  @Event({ eventName: "cellEnter", cancelable: true, bubbles: true })
  cellEnter: EventEmitter<RibbonCellEvent>;

  /**
   * Emitted when the mouse leaves a ribbon cell.
   */
  @Event({ eventName: "cellLeave", cancelable: true, bubbles: true })
  cellLeave: EventEmitter<RibbonCellEvent>;

  /**
   * Emitted when a group label is clicked.
   */
  @Event({ eventName: "groupClick", cancelable: true, bubbles: true })
  groupClick: EventEmitter<RibbonGroupEvent>;

  /**
   * Emitted when the mouse enters a group label.
   */
  @Event({ eventName: "groupEnter", cancelable: true, bubbles: true })
  groupEnter: EventEmitter<RibbonGroupEvent>;

  /**
   * Emitted when the mouse leaves a group label.
   */
  @Event({ eventName: "groupLeave", cancelable: true, bubbles: true })
  groupLeave: EventEmitter<RibbonGroupEvent>;

  /**
   * Lifecycle method called when the component has loaded.
   * Fetches data based on the provided subjects and subset.
   */
  async componentWillLoad() {
    // Use .then() instead of await in order to not block the initial
    // render while the call to fetchData resolves.
    this.fetchData().then(() => this.selectedChanged());
  }

  /**
   * Sets the data for the ribbon manually.
   *
   * Once this method is called, the provided data will be used and changes to the subjects,
   * subset, or apiEndpoint properties will not trigger a data fetch.
   * @param data
   */
  @Method()
  async setData(data: RibbonData | undefined) {
    this.dataManuallySet = true;
    if (!data) {
      this.selectedGroup = null;
      this.selectedSubjects = [];
    }
    this.data = data;
  }

  private async fetchData() {
    if (!this.subjects) {
      return;
    }

    try {
      this.loading = true;
      this.loadingError = false;
      this.data = await getRibbonSummary(
        this.apiEndpoint,
        this.subjects,
        this.subset,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loadingError = true;
    } finally {
      this.loading = false;
    }
  }

  private groupsEqual(a: RibbonGroup | null, b: RibbonGroup | null): boolean {
    // If objects are the same reference, return true
    if (a === b) {
      return true;
    }
    // If either object is null, return false
    if (!a || !b) {
      return false;
    }
    // Compare properties of the objects
    return a.id === b.id && a.type === b.type;
  }

  private subjectsEqual(a: RibbonSubject[], b: RibbonSubject[]): boolean {
    return sameArray(a, b, (s1, s2) => s1.id === s2.id);
  }

  private onCellEnter(subject: RibbonSubject, group: RibbonGroup) {
    if (this.selectionMode === "column") {
      this.hoveredSubjects = this.data.subjects;
    } else {
      this.hoveredSubjects = [subject];
    }
    this.hoveredGroup = group;

    this.cellEnter.emit({
      subjects: this.hoveredSubjects,
      group: this.hoveredGroup,
    });
  }

  private onCellLeave() {
    this.cellLeave.emit({
      subjects: this.hoveredSubjects,
      group: this.hoveredGroup,
    });
    this.hoveredSubjects = [];
    this.hoveredGroup = null;
  }

  private onCellClick(subject: RibbonSubject, group: RibbonGroup) {
    const numberOfAnnotations = getNbAnnotations(group, subject);
    if (numberOfAnnotations === 0) {
      return;
    }
    if (
      this.groupsEqual(this.selectedGroup, group) &&
      (this.selectionMode === "column" ||
        this.subjectsEqual(this.selectedSubjects, [subject]))
    ) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects =
        this.selectionMode === "column" ? this.data.subjects : [subject];
      this.selectedGroup = group;
    }
    this.cellClick.emit({
      subjects: this.selectedSubjects,
      group: this.selectedGroup,
    });
  }

  private onGroupClick(category: RibbonCategory, group: RibbonGroup) {
    if (!this.groupClickable) {
      return;
    }
    const totalAnnotations = this.data.subjects.reduce(
      (total, subject) => total + getNbAnnotations(group, subject),
      0,
    );
    if (totalAnnotations === 0) {
      return;
    }
    if (this.groupsEqual(this.selectedGroup, group)) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects = this.data.subjects;
      this.selectedGroup = group;
    }
    this.groupClick.emit({
      category: this.selectedGroup ? category : null,
      group: this.selectedGroup,
    });
  }

  private onGroupEnter(category: RibbonCategory, group: RibbonGroup) {
    this.hoveredGroup = group;
    this.hoveredSubjects = this.data.subjects;
    this.groupEnter.emit({
      category,
      group,
    });
  }

  private onGroupLeave(category: RibbonCategory, group: RibbonGroup) {
    this.hoveredGroup = null;
    this.hoveredSubjects = [];
    this.groupLeave.emit({
      category,
      group,
    });
  }

  private isGroupHovered(group: RibbonGroup): boolean {
    return this.groupsEqual(this.hoveredGroup, group);
  }

  private isCellHovered(subject: RibbonSubject, group: RibbonGroup): boolean {
    return (
      this.isGroupHovered(group) &&
      this.hoveredSubjects.findIndex((s) => s.id === subject.id) >= 0
    );
  }

  private isGroupSelected(group: RibbonGroup): boolean {
    return this.groupsEqual(this.selectedGroup, group);
  }

  private isCellSelected(subject: RibbonSubject, group: RibbonGroup): boolean {
    return (
      this.isGroupSelected(group) &&
      this.selectedSubjects.findIndex((s) => s.id === subject.id) >= 0
    );
  }

  private formatGroupLabel(category: string) {
    return truncate(category, this.groupMaxLabelSize, "...");
  }

  private formatGroupTitle(group: RibbonGroup): string {
    return `${group.id}: ${group.label}\n\n${group.description}`;
  }

  render() {
    if (this.loading) {
      return <go-spinner></go-spinner>;
    }

    if (!this.data) {
      return null;
    }

    // API request done but not subject retrieved
    const nbSubjects: number = this.data.subjects.length;
    if (nbSubjects == 0) {
      return <div>Must provide at least one subject</div>;
    }

    // Data is present, show the ribbon
    return (
      <Host>
        <div class="container">
          <table class="ribbon">
            {this.renderCategories()}
            {this.renderSubjects()}
          </table>
          <go-info-popover placement="bottom-end"></go-info-popover>
        </div>
      </Host>
    );
  }

  renderCategories() {
    return (
      <thead>
        <tr class="categories">
          {this.subjectPosition === "left" && <th />}
          {this.showAllAnnotationsGroup && (
            <th
              class={clsx({
                group: true,
                "category-all": true,
                hovered: this.isGroupHovered(GROUP_ALL),
                selected: this.isGroupSelected(GROUP_ALL),
              })}
              title={this.formatGroupTitle(GROUP_ALL)}
            >
              <div
                class={clsx({
                  label: true,
                  clickable: this.groupClickable,
                })}
                onMouseEnter={() => this.onGroupEnter(null, GROUP_ALL)}
                onMouseLeave={() => this.onGroupLeave(null, GROUP_ALL)}
                onClick={() => this.onGroupClick(undefined, GROUP_ALL)}
              >
                {this.formatGroupLabel(GROUP_ALL.label)}
              </div>
            </th>
          )}

          {this.data.categories.map((category: RibbonCategory, categoryIndex) =>
            category.groups.map((group: RibbonGroup, groupIndex) =>
              group.type === "Other" && !this.showOtherGroup ? null : (
                <Fragment>
                  {groupIndex === 0 &&
                    (categoryIndex > 0 || this.showAllAnnotationsGroup) && (
                      <th class="separator" />
                    )}
                  <th
                    class={clsx({
                      group: true,
                      "category-all": group.type === "All",
                      "category-other": group.type === "Other",
                      hovered: this.isGroupHovered(group),
                      selected: this.isGroupSelected(group),
                    })}
                    key={groupKey(group)}
                    title={this.formatGroupTitle(group)}
                  >
                    <div
                      class={clsx({
                        label: true,
                        clickable: this.groupClickable,
                      })}
                      onMouseEnter={() => this.onGroupEnter(category, group)}
                      onMouseLeave={() => this.onGroupLeave(category, group)}
                      onClick={
                        this.groupClickable
                          ? () => this.onGroupClick(category, group)
                          : undefined
                      }
                    >
                      {this.formatGroupLabel(group.label)}
                    </div>
                  </th>
                </Fragment>
              ),
            ),
          )}
          {this.subjectPosition === "right" && <th />}
        </tr>
      </thead>
    );
  }

  renderSubjects() {
    return (
      <tbody>
        {this.data.subjects.map((subject: RibbonSubject) => {
          return (
            <tr key={subject.id}>
              {this.subjectPosition === "left" && (
                <td class="subject">
                  <go-annotation-ribbon-subject
                    subject={subject}
                    subjectBaseURL={this.subjectBaseUrl}
                    newTab={this.subjectOpenNewTab}
                  />
                </td>
              )}

              {this.showAllAnnotationsGroup && (
                <td class="cell">
                  <go-annotation-ribbon-cell
                    subject={subject}
                    group={GROUP_ALL}
                    hovered={this.isCellHovered(subject, GROUP_ALL)}
                    selected={this.isCellSelected(subject, GROUP_ALL)}
                    colorBy={this.colorBy}
                    binaryColor={this.binaryColor}
                    minColor={this.minColor}
                    maxColor={this.maxColor}
                    maxHeatLevel={this.maxHeatLevel}
                    annotationLabels={this.annotationLabels}
                    classLabels={this.classLabels}
                    onClick={() => this.onCellClick(subject, GROUP_ALL)}
                    onMouseEnter={() => this.onCellEnter(subject, GROUP_ALL)}
                    onMouseLeave={() => this.onCellLeave()}
                  />
                </td>
              )}

              {this.data.categories.map(
                (category: RibbonCategory, categoryIndex) =>
                  category.groups.map((group: RibbonGroup, groupIndex) => {
                    const cellid =
                      group.id + (group.type === "Other" ? "-other" : "");
                    const cell =
                      cellid in subject.groups
                        ? subject.groups[cellid]
                        : undefined;

                    // by default the group should be available
                    let available = true;

                    // if a value was given, then override the default value
                    if (
                      cell &&
                      Object.prototype.hasOwnProperty.call(cell, "available")
                    ) {
                      available = cell.available;
                    }

                    if (group.type === "Other" && !this.showOtherGroup) {
                      return;
                    }

                    return (
                      <Fragment>
                        {groupIndex === 0 &&
                          (categoryIndex > 0 ||
                            this.showAllAnnotationsGroup) && (
                            <td class="separator" />
                          )}
                        <td
                          class={clsx({
                            cell: true,
                          })}
                        >
                          <go-annotation-ribbon-cell
                            key={cellKey(subject, group)}
                            subject={subject}
                            group={group}
                            available={available}
                            hovered={this.isCellHovered(subject, group)}
                            selected={this.isCellSelected(subject, group)}
                            colorBy={this.colorBy}
                            binaryColor={this.binaryColor}
                            minColor={this.minColor}
                            maxColor={this.maxColor}
                            maxHeatLevel={this.maxHeatLevel}
                            annotationLabels={this.annotationLabels}
                            classLabels={this.classLabels}
                            onClick={() => this.onCellClick(subject, group)}
                            onMouseEnter={() =>
                              this.onCellEnter(subject, group)
                            }
                            onMouseLeave={() => this.onCellLeave()}
                          />
                        </td>
                      </Fragment>
                    );
                  }),
              )}

              {this.subjectPosition === "right" && (
                <td class="subject">
                  <go-annotation-ribbon-subject
                    subject={subject}
                    subjectBaseURL={this.subjectBaseUrl}
                    newTab={this.subjectOpenNewTab}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    );
  }
}
