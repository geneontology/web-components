import {
  Component,
  Element,
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
} from "../../globals/models";

import {
  CELL_TYPES,
  EXP_CODES,
  FONT_CASE,
  FONT_STYLE,
  POSITION,
  SELECTION,
} from "../../globals/enums";
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
  @Element() ribbonElement;

  @Prop() baseApiUrl = "https://api.geneontology.org/api/ontology/ribbon/";

  @Prop() subjectBaseUrl: string =
    "http://amigo.geneontology.org/amigo/gene_product/";
  @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

  @Prop() subset: string = "goslim_agr";

  /**
   * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
   */
  @Prop() subjects: string = undefined;

  @Prop() classLabels = "term,terms";
  @Prop() annotationLabels = "annotation,annotations";

  /**
   * Which value to base the cell color on
   * 0 = class count
   * 1 = annotation count
   */
  @Prop() colorBy: ColorByOption = "annotations";

  /**
   * false = show a gradient of colors to indicate the value of a cell
   * true = show only two colors (minColor; maxColor) to indicate the values of a cell
   */
  @Prop() binaryColor = false;
  @Prop() minColor = "255,255,255";
  @Prop() maxColor = "24,73,180";
  @Prop() maxHeatLevel = 48;
  @Prop() groupMaxLabelSize = 60;

  /**
   * Override of the category case
   * 0 (default) = unchanged
   * 1 = to lower case
   * 2 = to upper case
   */
  @Prop() categoryCase = FONT_CASE.LOWER_CASE;

  /**
   * 0 = Normal
   * 1 = Bold
   */
  @Prop() categoryAllStyle = FONT_STYLE.NORMAL;
  /**
   * 0 = Normal
   * 1 = Bold
   */
  @Prop() categoryOtherStyle = FONT_STYLE.NORMAL;

  @Prop() showOtherGroup = false;

  /**
   * Position the subject label of each row
   * 0 = None
   * 1 = Left
   * 2 = Right
   * 3 = Bottom
   */
  @Prop() subjectPosition = POSITION.LEFT;
  @Prop() subjectUseTaxonIcon: boolean;
  @Prop() subjectOpenNewTab: boolean = true;
  @Prop() groupNewTab: boolean = true;
  @Prop() groupClickable: boolean = true;

  /**
   * Click handling of a cell.
   * 0 = select only the cell (1 subject, 1 group)
   * 1 = select the whole column (all subjects, 1 group)
   */
  @Prop() selectionMode = SELECTION.CELL;

  /**
   * If no value is provided, the ribbon will load without any group selected.
   * If a value is provided, the ribbon will show the requested group as selected
   * The value should be the id of the group to be selected
   */
  @Prop() selected;

  /**
   * If true, the ribbon will fire an event if a user click an empty cell
   * If false, the ribbon will not fire the event on an empty cell
   * Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
   */
  @Prop() fireEventOnEmptyCells = false;

  // @Watch('selected')
  // selectedChanged(newValue, oldValue) {
  //     console.log("selectedChanged(", newValue , oldValue , ")");
  //     if(newValue != oldValue) {
  //         let gp = this.getGroup(newValue);
  //         this.selectCells(this.ribbonSummary.subjects, gp);
  //     }
  // }

  /**
   * add a cell at the beginning of each row/subject to show all annotations
   */
  @Prop() addCellAll: boolean = true;

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

  @State() selectedGroup: IRibbonGroup | null = null;
  @State() selectedSubjects: IRibbonSubject[] = [];

  @State() hoveredGroup: IRibbonGroup | null = null;
  @State() hoveredSubjects: IRibbonSubject[] = [];

  /**
   * This event is triggered whenever a ribbon cell is clicked
   */
  @Event({ eventName: "cellClick", cancelable: true, bubbles: true })
  cellClick: EventEmitter<IRibbonCellEvent>;

  /**
   * This event is triggered whenever the mouse enters a cell area
   */
  @Event({ eventName: "cellEnter", cancelable: true, bubbles: true })
  cellEnter: EventEmitter<IRibbonCellEvent>;

  /**
   * This event is triggered whenever the mouse leaves a cell area
   */
  @Event({ eventName: "cellLeave", cancelable: true, bubbles: true })
  cellLeave: EventEmitter<IRibbonCellEvent>;

  /**
   * This event is triggered whenever a group cell is clicked
   */
  @Event({ eventName: "groupClick", cancelable: true, bubbles: true })
  groupClick: EventEmitter<IRibbonGroupEvent>;

  /**
   * This event is triggered whenever the mouse enters a group cell area
   */
  @Event({ eventName: "groupEnter", cancelable: true, bubbles: true })
  groupEnter: EventEmitter<IRibbonGroupEvent>;

  /**
   * This event is triggered whenever the mouse leaves a group cell area
   */
  @Event({ eventName: "groupLeave", cancelable: true, bubbles: true })
  groupLeave: EventEmitter<IRibbonGroupEvent>;

  @Prop() ribbonSummary: IRibbonModel;

  loading = true;
  onlyExperimental = false;

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

    let query =
      this.baseApiUrl + "?subset=" + this.subset + "&subject=" + subjects;
    if (this.onlyExperimental) {
      query += EXP_CODES.map((exp) => "&ecodes=" + exp).join("");
    }
    console.log("API query is " + query);

    return fetch(query)
      .then((response: Response) => {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }

  filterExperiment(checkbox) {
    this.onlyExperimental = checkbox.target.checked;

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

  onCellEnter(subject: IRibbonSubject, group: IRibbonGroup) {
    if (this.selectionMode === SELECTION.COLUMN) {
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
      (this.selectionMode === SELECTION.COLUMN ||
        sameArray(this.selectedSubjects, [subject]))
    ) {
      this.selectedSubjects = [];
      this.selectedGroup = null;
    } else {
      this.selectedSubjects =
        this.selectionMode === SELECTION.COLUMN
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
    const cc0 = truncate(category, this.groupMaxLabelSize, "...");
    const cc1 = this.applyCategoryCase(cc0);
    const cc2 = this.applyCategoryBold(cc1);
    return cc2;
  }

  applyCategoryBold(category) {
    const lc = category.toLowerCase();
    if (lc.startsWith("all") && this.categoryAllStyle == FONT_STYLE.BOLD) {
      return <b>{category}</b>;
    }
    if (lc.startsWith("other") && this.categoryOtherStyle == FONT_STYLE.BOLD) {
      return <b>{category}</b>;
    }
    return category;
  }

  applyCategoryCase(category) {
    if (this.categoryCase == FONT_CASE.LOWER_CASE) {
      return category.toLowerCase();
    } else if (this.categoryCase == FONT_CASE.UPPER_CASE) {
      return category.toUpperCase();
    }
    return category;
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
        {/* <br/>
            <input type="checkbox" onClick={ this.filterExperiment.bind(this) }/> Show only experimental annotations */}
      </Host>
    );
  }

  renderCategories() {
    return (
      <div
        class={clsx(
          "categories",
          this.subjectPosition === POSITION.LEFT && "offset-left",
        )}
      >
        {this.addCellAll && (
          <div
            class={clsx({
              group: true,
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
              group.type == CELL_TYPES.OTHER && !this.showOtherGroup ? null : (
                <div
                  class={clsx({
                    group: true,
                    clickable: this.groupClickable,
                    hovered: this.isGroupHovered(group),
                    selected: this.isGroupSelected(group),
                    separated:
                      groupIndex === 0 &&
                      (categoryIndex > 0 || this.addCellAll),
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
          {this.subjectPosition == POSITION.LEFT && (
            <go-annotation-ribbon-subject
              subject={subject}
              subjectBaseURL={this.subjectBaseUrl}
              newTab={this.subjectOpenNewTab}
            />
          )}

          {this.addCellAll && (
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
                  group.id + (group.type == CELL_TYPES.OTHER ? "-other" : "");
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

                if (group.type == CELL_TYPES.OTHER && !this.showOtherGroup) {
                  return;
                }

                return (
                  <go-annotation-ribbon-cell
                    class={clsx({
                      separated:
                        groupIndex === 0 &&
                        (categoryIndex > 0 || this.addCellAll),
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

          {this.subjectPosition == POSITION.RIGHT && (
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
