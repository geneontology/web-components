import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import clsx from "clsx";

import { groupKey, cellKey, truncate } from "./utils";

import {
  ColorByOption,
  IRibbonCategory,
  IRibbonCellEvent,
  IRibbonGroup,
  IRibbonGroupEvent,
  IRibbonModel,
  IRibbonSubject,
  SelectionModeOption,
  SubjectPositionOption,
} from "../../globals/models";
import { sameArray } from "../../globals/utils";
import { getRibbonSummary } from "../../globals/api";

const GROUP_ALL: IRibbonGroup = {
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

  @State() selectedGroup: IRibbonGroup | null = null;
  @State() selectedSubjects: IRibbonSubject[] = [];
  @State() hoveredGroup: IRibbonGroup | null = null;
  @State() hoveredSubjects: IRibbonSubject[] = [];

  @State() loading: boolean = false;
  @State() loadingError: boolean = false;
  @State() data?: IRibbonModel;

  /**
   * Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)
   */
  @Prop() subjects?: string;

  /**
   * Name of the GO subset used for grouping annotations.
   */
  @Prop() subset: string = "goslim_agr";

  /**
   * Base URL for the API to fetch the ribbon data when subjects are provided.
   */
  @Prop() baseApiUrl = "https://api.geneontology.org/api/ontology/ribbon/";

  /**
   * Base URL used when rendering subject label links.
   */
  @Prop() subjectBaseUrl: string =
    "http://amigo.geneontology.org/amigo/gene_product/";

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
  @Watch("baseApiUrl")
  doFetch() {
    if (this.dataManuallySet) {
      // If data was manually set, do not fetch again
      return;
    }
    return this.fetchData();
  }

  /**
   * Emitted when a ribbon cell is clicked.
   */
  @Event({ eventName: "cellClick", cancelable: true, bubbles: true })
  cellClick: EventEmitter<IRibbonCellEvent>;

  /**
   * Emitted when the mouse enters a ribbon cell.
   */
  @Event({ eventName: "cellEnter", cancelable: true, bubbles: true })
  cellEnter: EventEmitter<IRibbonCellEvent>;

  /**
   * Emitted when the mouse leaves a ribbon cell.
   */
  @Event({ eventName: "cellLeave", cancelable: true, bubbles: true })
  cellLeave: EventEmitter<IRibbonCellEvent>;

  /**
   * Emitted when a group label is clicked.
   */
  @Event({ eventName: "groupClick", cancelable: true, bubbles: true })
  groupClick: EventEmitter<IRibbonGroupEvent>;

  /**
   * Emitted when the mouse enters a group label.
   */
  @Event({ eventName: "groupEnter", cancelable: true, bubbles: true })
  groupEnter: EventEmitter<IRibbonGroupEvent>;

  /**
   * Emitted when the mouse leaves a group label.
   */
  @Event({ eventName: "groupLeave", cancelable: true, bubbles: true })
  groupLeave: EventEmitter<IRibbonGroupEvent>;

  /**
   * Lifecycle method called when the component has loaded.
   * Fetches data based on the provided subjects and subset.
   */
  async componentWillLoad() {
    // Use .then() instead of await in order to not block the initial
    // render while the call to fetchData resolves.
    this.fetchData().then(() => this.selectedChanged());
  }

  @Method()
  async setData(data: IRibbonModel) {
    this.dataManuallySet = true;
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
        this.baseApiUrl,
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

  private onCellEnter(subject: IRibbonSubject, group: IRibbonGroup) {
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

  private onCellClick(subject: IRibbonSubject, group: IRibbonGroup) {
    if (
      this.selectedGroup === group &&
      (this.selectionMode === "column" ||
        sameArray(this.selectedSubjects, [subject]))
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

  private onGroupClick(category: IRibbonCategory, group: IRibbonGroup) {
    if (!this.groupClickable) {
      return;
    }
    if (
      this.selectedGroup === group &&
      sameArray(this.selectedSubjects, this.data.subjects)
    ) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects = this.data.subjects;
      this.selectedGroup = group;
    }
    this.groupClick.emit({
      category,
      group,
    });
  }

  private onGroupEnter(category: IRibbonCategory, group: IRibbonGroup) {
    this.hoveredGroup = group;
    this.hoveredSubjects = this.data.subjects;
    this.groupEnter.emit({
      category,
      group,
    });
  }

  private onGroupLeave(category: IRibbonCategory, group: IRibbonGroup) {
    this.hoveredGroup = null;
    this.hoveredSubjects = [];
    this.groupLeave.emit({
      category,
      group,
    });
  }

  private isGroupHovered(group: IRibbonGroup): boolean {
    return this.hoveredGroup === group;
  }

  private isCellHovered(subject: IRibbonSubject, group: IRibbonGroup): boolean {
    return (
      this.hoveredGroup === group && this.hoveredSubjects.includes(subject)
    );
  }

  private isGroupSelected(group: IRibbonGroup): boolean {
    return this.selectedGroup === group;
  }

  private isCellSelected(
    subject: IRibbonSubject,
    group: IRibbonGroup,
  ): boolean {
    return (
      this.selectedGroup === group && this.selectedSubjects.includes(subject)
    );
  }

  private formatGroupLabel(category: string) {
    return truncate(category, this.groupMaxLabelSize, "...");
  }

  private formatGroupTitle(group: IRibbonGroup): string {
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
        <div class="ribbon">
          {this.renderCategories()}
          {this.renderSubjects()}
        </div>
      </Host>
    );
  }

  renderCategories() {
    return (
      <div
        class={clsx(
          "categories",
          this.subjectPosition === "left" && "offset-left",
        )}
      >
        {this.showAllAnnotationsGroup && (
          <div
            class={clsx({
              group: true,
              "category-all": true,
              clickable: this.groupClickable,
              hovered: this.isGroupHovered(GROUP_ALL),
              selected: this.isGroupSelected(GROUP_ALL),
            })}
            title={this.formatGroupTitle(GROUP_ALL)}
            onMouseEnter={() => this.onGroupEnter(null, GROUP_ALL)}
            onMouseLeave={() => this.onGroupLeave(null, GROUP_ALL)}
            onClick={() => this.onGroupClick(undefined, GROUP_ALL)}
          >
            {this.formatGroupLabel(GROUP_ALL.label)}
          </div>
        )}

        {this.data.categories.map((category: IRibbonCategory, categoryIndex) =>
          category.groups.map((group: IRibbonGroup, groupIndex) =>
            group.type === "Other" && !this.showOtherGroup ? null : (
              <div
                class={clsx({
                  group: true,
                  "category-all": group.type === "All",
                  "category-other": group.type === "Other",
                  clickable: this.groupClickable,
                  hovered: this.isGroupHovered(group),
                  selected: this.isGroupSelected(group),
                  separated:
                    groupIndex === 0 &&
                    (categoryIndex > 0 || this.showAllAnnotationsGroup),
                })}
                key={groupKey(group)}
                title={this.formatGroupTitle(group)}
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
            ),
          ),
        )}
      </div>
    );
  }

  renderSubjects() {
    return this.data.subjects.map((subject: IRibbonSubject) => {
      return (
        <div class="subject" key={subject.id}>
          {this.subjectPosition === "left" && (
            <go-annotation-ribbon-subject
              subject={subject}
              subjectBaseURL={this.subjectBaseUrl}
              newTab={this.subjectOpenNewTab}
            />
          )}

          {this.showAllAnnotationsGroup && (
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
          )}

          {this.data.categories.map(
            (category: IRibbonCategory, categoryIndex) =>
              category.groups.map((group: IRibbonGroup, groupIndex) => {
                const cellid =
                  group.id + (group.type === "Other" ? "-other" : "");
                const cell =
                  cellid in subject.groups ? subject.groups[cellid] : undefined;

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
                  <go-annotation-ribbon-cell
                    class={clsx({
                      separated:
                        groupIndex === 0 &&
                        (categoryIndex > 0 || this.showAllAnnotationsGroup),
                    })}
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
                    onMouseEnter={() => this.onCellEnter(subject, group)}
                    onMouseLeave={() => this.onCellLeave()}
                  />
                );
              }),
          )}

          {this.subjectPosition === "right" && (
            <go-annotation-ribbon-subject
              subject={subject}
              subjectBaseURL={this.subjectBaseUrl}
              newTab={this.subjectOpenNewTab}
            />
          )}
        </div>
      );
    });
  }
}
