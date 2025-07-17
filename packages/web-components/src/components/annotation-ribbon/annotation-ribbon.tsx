import { Component, h, Host, Listen, Prop, State, Watch } from "@stencil/core";

import {
  ColorByOption,
  IRibbonCellEvent,
  IRibbonGroup,
  IRibbonGroupEvent,
  IRibbonModel,
  IRibbonSubject,
  SelectionModeOption,
  SubjectPositionOption,
  TableData,
} from "../../globals/models";

import { diffAssociations, getCategory, getCategoryIdLabel } from "./utils";
import { getRibbonSummary, getTableData } from "../../globals/api";

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
  private stripsElement: HTMLGoAnnotationRibbonStripsElement;
  private tableElement: HTMLGoAnnotationRibbonTableElement;

  @State() ribbonData?: IRibbonModel;
  @State() ribbonDataLoading = false;
  @State() ribbonDataLoadingError = false;

  @State() tableDataLoading = false;
  @State() tableDataLoadingError = false;

  /**
   * URL for the API endpoint to fetch the ribbon data when subjects are provided.
   */
  @Prop() ribbonDataApiEndpoint =
    "https://api.geneontology.org/api/ontology/ribbon/";

  /**
   * URL for the API endpoint to fetch the table data when a group is selected.
   * This is used to fetch the annotations for the selected group and subjects.
   */
  @Prop() tableDataApiEndpoint =
    "https://api.geneontology.org/api/bioentityset/slimmer/function";

  /**
   * Base URL used when rendering subject label links.
   */
  @Prop()
  subjectBaseUrl: string = "https://amigo.geneontology.org/amigo/gene_product/";

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
  @Prop() selected?: string;

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
   * Comma-separated list of reference prefixes to filter include
   */
  @Prop() filterReference = "PMID:,DOI:,GO_REF:,Reactome:";

  /**
   * If true, will exclude the protein binding GO term (GO:0005515) from the table
   */
  @Prop() excludeProteinBinding = true;

  /**
   * If true, the table will filter out associations that are cross-aspect
   */
  @Prop() filterCrossAspect = true;

  /**
   * This method is automatically called whenever the value of "subjects" changes
   * @param newValue a new subject is submitted (e.g. gene)
   * @param oldValue old value of the subject (e.g. gene or genes)
   */
  @Watch("subjects")
  subjectsChanged() {
    void this.fetchRibbonData();
  }

  async componentWillLoad() {
    void this.fetchRibbonData();
  }

  private async fetchRibbonData() {
    if (!this.subjects) {
      return;
    }

    try {
      this.ribbonDataLoading = true;
      this.ribbonDataLoadingError = false;
      this.ribbonData = await getRibbonSummary(
        this.ribbonDataApiEndpoint,
        this.subjects,
        this.subset,
      );
      return this.stripsElement.setData(this.ribbonData);
    } catch (error) {
      console.error("Error loading ribbon data:", error);
      this.ribbonDataLoadingError = true;
    } finally {
      this.ribbonDataLoading = false;
    }
  }

  private async fetchTableData(
    group: IRibbonGroup,
    subjects: IRibbonSubject[],
  ) {
    if (!this.ribbonData) {
      return;
    }

    const groupIds =
      group.id === "all"
        ? this.ribbonData.categories.map((category) => category.id)
        : [group.id];
    const subjectIds = subjects.map((subject) => subject.id);

    try {
      await this.tableElement.setData(undefined);
      this.tableDataLoading = true;
      this.tableDataLoadingError = false;
      const tableData = await getTableData(
        this.tableDataApiEndpoint,
        subjectIds,
        groupIds,
      );
      this.applyTableFilters(tableData, group);

      if (group.type === "Other") {
        const category = getCategory(group, this.ribbonData.categories);
        const categoryTermIds = category.groups
          .filter((group) => group.type === "Term")
          .map((group) => group.id);
        const specificGroupData = await getTableData(
          this.tableDataApiEndpoint,
          subjectIds,
          categoryTermIds,
        );
        this.applyTableFilters(specificGroupData, group);

        const allSpecificGroupAssociations = specificGroupData.flatMap(
          (entry) => entry.assocs,
        );

        tableData[0].assocs = diffAssociations(
          tableData[0].assocs,
          allSpecificGroupAssociations,
        );
      }
      await this.tableElement.setData(tableData);
    } catch (error) {
      console.error("Error loading table data:", error);
      this.tableDataLoadingError = true;
      await this.tableElement.setData(undefined);
    } finally {
      this.tableDataLoading = false;
    }
  }

  private applyTableFilters(data: TableData, group: IRibbonGroup) {
    if (this.filterCrossAspect) {
      this.applyFilterCrossAspect(data, group);
    }
  }

  private applyFilterCrossAspect(data: TableData, group: IRibbonGroup) {
    if (!this.ribbonData) {
      return;
    }
    const aspect = getCategoryIdLabel(group, this.ribbonData.categories);
    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter((assoc) => {
        const cat =
          assoc.object.category[0] == "molecular_activity"
            ? "molecular_function"
            : assoc.object.category[0];
        return aspect == undefined || cat == aspect[1];
      });
    }
  }

  @Listen("cellClick")
  onCellClick(e: CustomEvent<IRibbonCellEvent>) {
    if (!this.ribbonData) {
      return;
    }

    const { group, subjects } = e.detail;
    if (!group || subjects.length === 0) {
      void this.tableElement.setData(undefined);
    } else {
      void this.fetchTableData(group, subjects);
    }
  }

  @Listen("groupClick")
  onGroupClick(e: CustomEvent<IRibbonGroupEvent>) {
    if (!this.ribbonData) {
      return;
    }

    const { group } = e.detail;
    if (!group) {
      void this.tableElement.setData(undefined);
    } else {
      void this.fetchTableData(group, this.ribbonData.subjects);
    }
  }

  render() {
    return (
      <Host>
        <go-annotation-ribbon-strips
          ref={(el) => (this.stripsElement = el)}
          annotationLabels={this.annotationLabels}
          binaryColor={this.binaryColor}
          classLabels={this.classLabels}
          colorBy={this.colorBy}
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
        />
        {this.ribbonDataLoading && <go-spinner />}
        {this.ribbonDataLoadingError && (
          <div class="error">Error loading ribbon data.</div>
        )}

        {this.ribbonData && (
          <div class="muted margin-bottom">
            Cell color indicative of annotation volume
          </div>
        )}

        {this.tableDataLoading && <go-spinner></go-spinner>}
        <go-annotation-ribbon-table
          ref={(el) => (this.tableElement = el)}
          groupBy={this.groupBy}
          orderBy={this.orderBy}
          filterBy={this.filterBy}
          hideColumns={this.hideColumns}
          filterReference={this.filterReference}
          excludeProteinBinding={this.excludeProteinBinding}
        />
        {this.tableDataLoadingError && (
          <div class="error">Error loading table data.</div>
        )}
      </Host>
    );
  }
}
