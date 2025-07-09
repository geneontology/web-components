import {
  Component,
  Element,
  h,
  Prop,
  Watch,
  State,
  Host,
  Listen,
} from "@stencil/core";

import {
  ColorByOption,
  IRibbonCellEvent,
  IRibbonGroup,
} from "../../globals/models";

import {
  POSITION,
  SELECTION,
  FONT_CASE,
  FONT_STYLE,
} from "../../globals/enums";

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
  @Element() GORibbon;

  ribbonStrips: HTMLGoAnnotationRibbonStripsElement;
  ribbonTable: HTMLGoAnnotationRibbonTableElement;

  @State() loadingTable = false;

  mockup = [
    {
      subject: "UniProtKB:P04637",
      slim: "GO:0003723",
      assocs: [
        {
          id: "556e6950726f744b420950303436333709545035330909474f3a3030303337333009504d49443a3136323133323132094944410909460943656c6c756c61722074756d6f7220616e746967656e20703533095035330970726f7465696e097461786f6e3a393630360932303137303132350943414641090909",
          subject: {
            id: "HGNC:11998",
            iri: "http://identifiers.org/uniprot/P04637",
            label: "TP53",
            taxon: {
              id: "NCBITaxon:9606",
              iri: "http://purl.obolibrary.org/obo/NCBITaxon_9606",
              label: "Homo sapiens",
            },
          },
          object: {
            id: "GO:0003730",
            iri: "http://purl.obolibrary.org/obo/GO_0003730",
            label: "mRNA 3'-UTR binding",
            category: ["molecular_activity"],
          },
          negated: false,
          relation: null,
          publications: [{ id: "UniProtKB" }],
          provided_by: ["CAFA"],
          reference: ["PMID:16213212"],
          type: "protein",
          evidence: "ECO:0000314",
          evidence_label: "direct assay evidence used in manual assertion",
          evidence_type: "IDA",
          evidence_closure: [
            "ECO:0000352",
            "ECO:0000000",
            "ECO:0000002",
            "ECO:0000006",
            "ECO:0000314",
            "ECO:0000269",
          ],
          evidence_closure_label: [
            "evidence used in manual assertion",
            "evidence",
            "direct assay evidence",
            "experimental evidence",
            "direct assay evidence used in manual assertion",
            "experimental evidence used in manual assertion",
          ],
          evidence_subset_closure: ["ECO:0000006", "ECO:0000314"],
          evidence_subset_closure_label: [
            "experimental evidence",
            "direct assay evidence used in manual assertion",
          ],
          evidence_type_closure: [
            "evidence used in manual assertion",
            "evidence",
            "direct assay evidence",
            "experimental evidence",
            "direct assay evidence used in manual assertion",
            "experimental evidence used in manual assertion",
          ],
          slim: ["GO:0003723"],
        },
      ],
    },
  ];

  @Prop() filterReference = "PMID:,DOI:,GO_REF:,Reactome:";

  @Prop() excludePB = true;

  @Prop() filterCrossAspect = true;

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

  /**
   * add a cell at the end of each row/subject to represent all annotations not mapped to a specific term
   */
  @Prop() showOtherGroup = true;

  /**
   * add a cell at the beginning of each row/subject to show all annotations
   */
  @Prop() addCellAll: boolean = true;

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
          base-api-url={this.baseApiUrl}
          subject-base-url={this.subjectBaseUrl}
          group-base-url={this.groupBaseUrl}
          add-cell-all={this.addCellAll}
          binary-color={this.binaryColor}
          color-by={this.colorBy}
          min-color={this.minColor}
          max-color={this.maxColor}
          max-heat-level={this.maxHeatLevel}
          annotation-labels={this.annotationLabels}
          class-labels={this.classLabels}
          data={this.data}
          category-case={this.categoryCase}
          category-all-style={this.categoryAllStyle}
          categoryOtherStyle={this.categoryOtherStyle}
          group-max-label-size={this.groupMaxLabelSize}
          group-new-tab={this.groupNewTab}
          group-clickable={this.groupClickable}
          fire-event-on-empty-cells={this.fireEventOnEmptyCells}
          subjects={this.subjects}
          subject-open-new-tab={this.subjectOpenNewTab}
          subject-position={this.subjectPosition}
          subject-use-taxon-icon={this.subjectUseTaxonIcon}
          selection-mode={this.selectionMode}
          selected={this.selected}
          subset={this.subset}
          show-other-group={this.showOtherGroup}
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
