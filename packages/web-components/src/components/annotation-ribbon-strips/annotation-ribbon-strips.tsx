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
  @State() selectedGroup: IRibbonGroup | null = null;
  @State() selectedSubjects: IRibbonSubject[] = [];
  @State() hoveredGroup: IRibbonGroup | null = null;
  @State() hoveredSubjects: IRibbonSubject[] = [];

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
   * Name of the GO subset used for grouping annotations.
   */
  @Prop() subset: string = "goslim_agr";

  /**
   * Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)
   */
  @Prop() subjects?: string;

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
  @Prop() selected;

  // @Watch('selected')
  // selectedChanged(newValue, oldValue) {
  //     console.log("selectedChanged(", newValue , oldValue , ")");
  //     if(newValue != oldValue) {
  //         let gp = this.getGroup(newValue);
  //         this.selectCells(this.ribbonSummary.subjects, gp);
  //     }
  // }

  /**
   * if provided, will override any value provided in subjects and subset
   */
  @Prop() data: string;

  @Watch("data")
  dataChanged(newValue, oldValue) {
    if (newValue != oldValue) {
      this.loadData(newValue);
    }
  }

  /**
   * When this is set to false, changing the subjects Prop won't trigger the reload of the ribbon
   * This is necessary when the ribbon is showing data other than GO or not using the internal fetchData mechanism
   */
  @Prop() updateOnSubjectChange = true;

  /**
   * This method is automatically called whenever the value of "subjects" changes
   * Note this method can be (and should be) deactivated (use updateOnSubjectChange)
   * when the ribbon is not loading from GO and not using the internal fetchData mechanism
   * @param newValue a new subject is submitted (e.g. gene)
   * @param oldValue old value of the subject (e.g. gene or genes)
   */
  @Watch("subjects")
  subjectsChanged(newValue, oldValue) {
    // if we don't want to update the ribbon on subject changes
    if (!this.updateOnSubjectChange) {
      this.loading = false;
      return;
    }

    if (newValue != oldValue) {
      // Fetch data based on subjects and subset
      this.fetchData(this.subjects).then(
        (data) => {
          this.ribbonSummary = data;
          this.loading = false;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        },
      );
    }
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

  @Prop() ribbonSummary: IRibbonModel;

  loading = true;

  loadData(data) {
    if (data) {
      // If was injected as string, transform to json
      if (typeof data == "string") {
        this.ribbonSummary = JSON.parse(data);
      } else {
        this.ribbonSummary = data;
      }
      this.loading = false;
      this.subjects = this.ribbonSummary.subjects
        .map((elt) => elt.id)
        .join(",");
      return true;
    }
    return false;
  }

  getGroup(group_id) {
    if (!this.ribbonSummary) return null;
    if (group_id == "all") {
      return GROUP_ALL;
    }
    for (const cat of this.ribbonSummary.categories) {
      for (const gp of cat.groups) {
        if (gp.id == group_id) return gp;
      }
    }
    return null;
  }

  /**
   * Once the component is loaded, fetch the data
   */
  componentWillLoad() {
    // Prioritize data if provided
    if (this.loadData(this.data)) return;

    // If no subjects were provided, don't try to fetch data
    if (!this.subjects) {
      this.loading = false;
      return;
    }

    // Fetch data based on subjects and subset
    this.fetchData(this.subjects).then(
      (data) => {
        this.ribbonSummary = data;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      },
    );
  }

  componentDidLoad() {
    this.selectGroup(this.selected);
    this.selected = null;
  }

  fetchData(subjects) {
    if (subjects.includes(",")) {
      subjects = subjects.split(",");
    }
    if (subjects instanceof Array) {
      subjects = subjects.join("&subject=");
    }

    const query =
      this.baseApiUrl + "?subset=" + this.subset + "&subject=" + subjects;

    return fetch(query)
      .then((response: Response) => {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }

  onCellEnter(subject: IRibbonSubject, group: IRibbonGroup) {
    if (this.selectionMode === "column") {
      this.hoveredSubjects = this.ribbonSummary.subjects;
    } else {
      this.hoveredSubjects = [subject];
    }
    this.hoveredGroup = group;

    this.cellEnter.emit({
      subjects: this.hoveredSubjects,
      group: this.hoveredGroup,
    });
  }

  onCellLeave() {
    this.cellLeave.emit({
      subjects: this.hoveredSubjects,
      group: this.hoveredGroup,
    });
    this.hoveredSubjects = [];
    this.hoveredGroup = null;
  }

  onCellClick(subject: IRibbonSubject, group: IRibbonGroup) {
    if (
      this.selectedGroup === group &&
      (this.selectionMode === "column" ||
        sameArray(this.selectedSubjects, [subject]))
    ) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects =
        this.selectionMode === "column"
          ? this.ribbonSummary.subjects
          : [subject];
      this.selectedGroup = group;
    }
    this.cellClick.emit({
      subjects: this.selectedSubjects,
      group: this.selectedGroup,
    });
  }

  onGroupClick(category: IRibbonCategory, group: IRibbonGroup) {
    if (!this.groupClickable) {
      return;
    }
    if (
      this.selectedGroup === group &&
      sameArray(this.selectedSubjects, this.ribbonSummary.subjects)
    ) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects = this.ribbonSummary.subjects;
      this.selectedGroup = group;
    }
    this.groupClick.emit({
      category,
      group,
    });
  }

  onGroupEnter(category: IRibbonCategory, group: IRibbonGroup) {
    this.hoveredGroup = group;
    this.hoveredSubjects = this.ribbonSummary.subjects;
    this.groupEnter.emit({
      category,
      group,
    });
  }

  onGroupLeave(category: IRibbonCategory, group: IRibbonGroup) {
    this.hoveredGroup = null;
    this.hoveredSubjects = [];
    this.groupLeave.emit({
      category,
      group,
    });
  }

  applyCategoryStyling(category) {
    return truncate(category, this.groupMaxLabelSize, "...");
  }

  @Method()
  async selectGroup(group_id) {
    setTimeout(() => {
      if (group_id && this.ribbonSummary) {
        const gp = this.getGroup(group_id);
        if (gp) {
          this.selectedGroup = gp;
          this.selectedSubjects = this.ribbonSummary.subjects;
        } else {
          console.warn("Could not find group <", group_id, ">");
        }
      }
    }, 750);
  }

  isGroupHovered(group: IRibbonGroup): boolean {
    return this.hoveredGroup === group;
  }

  isCellHovered(subject: IRibbonSubject, group: IRibbonGroup): boolean {
    return (
      this.hoveredGroup === group && this.hoveredSubjects.includes(subject)
    );
  }

  isGroupSelected(group: IRibbonGroup): boolean {
    return this.selectedGroup === group;
  }

  isCellSelected(subject: IRibbonSubject, group: IRibbonGroup): boolean {
    return (
      this.selectedGroup === group && this.selectedSubjects.includes(subject)
    );
  }

  formatGroupTitle(group: IRibbonGroup): string {
    return `${group.id}: ${group.label}\n\n${group.description}`;
  }

  render() {
    // Still loading (executing fetch)
    if (this.loading) {
      // return ( "Loading Ribbon..." );
      return <go-spinner></go-spinner>;
    }

    if (!this.subjects && !this.ribbonSummary) {
      return <div>Must provide at least one subject</div>;
    }

    // API request undefined
    if (!this.ribbonSummary) {
      return <div>No data available</div>;
    }

    // API request done but not subject retrieved
    const nbSubjects: number = this.ribbonSummary.subjects.length;
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
            {this.applyCategoryStyling(GROUP_ALL.label)}
          </div>
        )}

        {this.ribbonSummary.categories.map(
          (category: IRibbonCategory, categoryIndex) =>
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
                  {this.applyCategoryStyling(group.label)}
                </div>
              ),
            ),
        )}
      </div>
    );
  }

  renderSubjects() {
    return this.ribbonSummary.subjects.map((subject: IRibbonSubject) => {
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

          {this.ribbonSummary.categories.map(
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
