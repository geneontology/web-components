import { Component, h, Prop, Watch, State, Host, Listen } from "@stencil/core";

import {
  ColorByOption,
  IRibbonCellEvent,
  IRibbonGroup,
  SelectionModeOption,
  SubjectPositionOption,
} from "../../globals/models";

import { getCategory, getCategoryIdLabel, diffAssociations } from "./utils";

/**
 * The Annotation Ribbon component summarizes [GO annotation](https://geneontology.org/docs/go-annotations/)
 * as a grid of cells. Each row in the grid (called "strips") represents a subject (typically a
 * gene), and each column represents a GO term. The color of each cell indicates the relative number
 * of GO annotations for that subject to the term or one of its descendants in the ontology
 * hierarchy. The columns are additionally grouped into categories which are visually separated in
 * the display.
 *
 * When a cell is clicked, a table of annotations is displayed below the strips. The table shows the
 * details of the annotations for the selected subject and term.
 *
 * For advanced use cases, the individual components of the ribbon can be used separately:
 * [strips](./annotation-ribbon-strips), [table](./annotation-ribbon-table).
 */
@Component({
  tag: "go-annotation-ribbon",
  styleUrl: "annotation-ribbon.scss",
  shadow: true,
})
export class AnnotationRibbon {
  ribbonStrips: HTMLGoAnnotationRibbonStripsElement;
  ribbonTable: HTMLGoAnnotationRibbonTableElement;

  @State() loadingTable = false;

  @Prop() filterReference = "PMID:,DOI:,GO_REF:,Reactome:";

  @Prop() excludePB = true;

  @Prop() filterCrossAspect = true;

  /**
   * Base URL for the API to fetch the ribbon data when subjects are provided.
   */
  @Prop() baseApiUrl = "https://api.geneontology.org/api/ontology/ribbon/";

  /**
   * Base URL used when rendering subject label links.
   */
  @Prop() subjectBaseUrl: string =
    "http://amigo.geneontology.org/amigo/gene_product/";

  @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

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
  @Prop() showOtherGroup = true;

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

  /**
   * if provided, will override any value provided in subjects and subset
   */
  @Prop() data: string;

  @State() selectedGroup: IRibbonGroup;

  onlyExperimental = false;

  /**
   * Using this parameter, the table rows can bee grouped based on column ids
   * A multiple step grouping is possible by using a ";" between groups
   * The grouping applies before the ordering
   * Example: hid-1,hid-3 OR hid-1,hid-3;hid-2
   * Note: if value is "", remove any grouping
   */
  @Prop() groupBy: string = "term,qualifier";

  /**
   * This is used to sort the table depending of a column
   * The column cells must be single values
   * The ordering applies after the grouping
   * Note: if value is "", remove any ordering
   */
  @Prop() orderBy: string = "term";

  /**
   * Filter rows based on the presence of one or more values in a given column
   * The filtering will be based on cell label or id
   * Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx"
   * Note: if value is "", remove any filtering
   */
  @Prop() filterBy: string;

  /**
   * Used to hide specific column of the table
   */
  @Prop() hideColumns: string = "qualifier";

  /**
   * Must follow the appropriate JSON data model
   * Can be given as either JSON or stringified JSON
   */
  @State() tableData: string;

  /**
   * Reading biolink data. This will trigger a render of the table as would changing data
   */
  @State() bioLinkData: string;

  /**
   * This method is automatically called whenever the value of "subjects" changes
   * @param newValue a new subject is submitted (e.g. gene)
   * @param oldValue old value of the subject (e.g. gene or genes)
   */
  @Watch("subjects")
  subjectsChanged(newValue, oldValue) {
    if (newValue != oldValue) {
      this.bioLinkData = undefined;
      this.tableData = undefined;
    }
  }

  applyTableFilters(data, group) {
    if (this.filterReference != "") {
      data = this.applyFilterReference(data);
    }
    if (this.excludePB) {
      data = this.applyFilterPB(data);
    }
    if (this.filterCrossAspect) {
      data = this.applyFilterCrossAspect(data, group);
    }
    return data;
  }

  applyFilterReference(data) {
    const filters = this.filterReference.includes(",")
      ? this.filterReference.split(",")
      : [this.filterReference.trim()];

    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter((assoc) => {
        assoc.reference = assoc.reference.filter((ref) =>
          filters.some((filter) => ref.includes(filter)),
        );
        return assoc;
      });
    }
    return data;
  }

  applyFilterPB(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter(
        (assoc) => assoc.object.id != "GO:0005515",
      );
    }
    return data;
  }

  applyFilterCrossAspect(data, group) {
    const aspect = getCategoryIdLabel(
      group,
      this.ribbonStrips.ribbonSummary.categories,
    );
    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter((assoc) => {
        const cat =
          assoc.object.category[0] == "molecular_activity"
            ? "molecular_function"
            : assoc.object.category[0];
        return aspect == undefined || cat == aspect[1];
      });
    }
    return data;
  }

  @Listen("cellClick")
  onCellClick(e: CustomEvent<IRibbonCellEvent>) {
    console.log("Cell Clicked", e.detail);

    const selection = e.detail;
    if (!selection.group || selection.subjects.length === 0) {
      this.bioLinkData = undefined;
      return;
    }

    const group = selection.group;
    let group_ids = group.id;
    const subject_ids = selection.subjects.map((elt) => elt.id);

    if (group.id == "all") {
      group_ids = this.ribbonStrips.ribbonSummary.categories
        .map((elt) => elt.id)
        .join("&slim=");
    }

    const goApiUrl = "https://api.geneontology.org/api/";
    const query =
      goApiUrl +
      "bioentityset/slimmer/function?slim=" +
      group_ids +
      "&subject=" +
      subject_ids.join("&subject=") +
      "&rows=-1";

    // fetch the json data
    this.loadingTable = true;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = this.applyTableFilters(data, group);

        if (group.type == "Other") {
          const aspect = getCategory(
            group,
            this.ribbonStrips.ribbonSummary.categories,
          );
          let terms = aspect.groups.filter((elt) => {
            return elt.type == "Term";
          });
          terms = terms.map((elt) => {
            return elt.id;
          });
          terms = terms.join("&slim=");

          const query_terms =
            goApiUrl +
            "bioentityset/slimmer/function?slim=" +
            terms +
            "&subject=" +
            subject_ids +
            "&rows=-1";

          // fetch the json data
          fetch(query_terms)
            .then((response_terms) => {
              return response_terms.json();
            })
            .then((data_terms) => {
              data_terms = this.applyTableFilters(data_terms, group);

              let concat_assocs = [];
              for (const array of data_terms) {
                concat_assocs = concat_assocs.concat(array.assocs);
              }

              const other_assocs = diffAssociations(
                data[0].assocs,
                concat_assocs,
              );
              data[0].assocs = other_assocs;
              this.loadingTable = false;
              this.bioLinkData = JSON.stringify(data);
            });
        } else {
          this.loadingTable = false;
          this.bioLinkData = JSON.stringify(data);
        }
      });
  }

  @Listen("groupClick")
  onGroupClick(e) {
    console.log("Group Clicked", e.detail);
  }

  render() {
    return (
      <Host>
        <go-annotation-ribbon-strips
          ref={(el) => (this.ribbonStrips = el)}
          annotationLabels={this.annotationLabels}
          baseApiUrl={this.baseApiUrl}
          binaryColor={this.binaryColor}
          classLabels={this.classLabels}
          colorBy={this.colorBy}
          data={this.data}
          groupClickable={this.groupClickable}
          groupMaxLabelSize={this.groupMaxLabelSize}
          maxColor={this.maxColor}
          maxHeatLevel={this.maxHeatLevel}
          minColor={this.minColor}
          selected={this.selected}
          selectionMode={this.selectionMode}
          showAllAnnotationsGroup={this.showAllAnnotationsGroup}
          showOtherGroup={this.showOtherGroup}
          subjectBaseUrl={this.subjectBaseUrl}
          subjectOpenNewTab={this.subjectOpenNewTab}
          subjectPosition={this.subjectPosition}
          subjects={this.subjects}
          subset={this.subset}
        />

        {((this.subjects && this.subjects.length > 0) || this.data) && (
          <div class="muted">Cell color indicative of annotation volume</div>
        )}

        {this.loadingTable ? (
          <go-spinner></go-spinner>
        ) : (
          <go-annotation-ribbon-table
            ref={(el) => (this.ribbonTable = el)}
            base-api-url={this.baseApiUrl}
            subject-base-url={this.subjectBaseUrl}
            group-base-url={this.groupBaseUrl}
            data={this.tableData}
            bio-link-data={this.bioLinkData}
            group-by={this.groupBy}
            order-by={this.orderBy}
            filter-by={this.filterBy}
            hide-columns={this.hideColumns}
          />
        )}
      </Host>
    );
  }
}
