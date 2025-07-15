import { Component, h, Method, Prop, State, Watch } from "@stencil/core";

import {
  IHeaderCell,
  ISuperCell,
  ITable,
  TableData,
} from "../../globals/models";
import { addEmptyCells, bioLinkToTable } from "./utils";

import * as dbxrefs from "@geneontology/dbxrefs";
import { getTableData } from "../../globals/api";
import { Draft, Immutable, produce } from "immer";

/**
 * The Annotation Ribbon Table component displays a table of GO annotations. This component does not
 * fetch data by itself, it expects the data to be provided in the `data` attribute.
 */
@Component({
  tag: "go-annotation-ribbon-table",
  styleUrl: "annotation-ribbon-table.scss",
  shadow: true,
})
export class AnnotationRibbonTable {
  @State() loading: boolean = false;
  @State() loadingError: boolean = false;
  @State() displayTable?: Immutable<ITable>;

  private tableData?: Immutable<TableData>;
  private headerMap?: Map<string, Immutable<IHeaderCell>>;
  private dataManuallySet: boolean = false;

  /**
   * Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)
   */
  @Prop() subjects?: string;

  /**
   * Comma-separate list of GO term IDs (e.g. GO:0003674,GO:0008150,GO:0005575)
   */
  @Prop() slims?: string;

  /**
   * URL for the API endpoint to fetch the table data when subjects and slims are provided.
   */
  @Prop() apiEndpoint =
    "https://api.geneontology.org/api/bioentityset/slimmer/function";

  /**
   * Using this parameter, the table rows can bee grouped based on column ids
   * A multiple step grouping is possible by using a ";" between groups
   * The grouping applies before the ordering
   * Example: hid-1,hid-3 OR hid-1,hid-3;hid-2
   */
  @Prop() groupBy?: string;

  /**
   * This is used to sort the table depending of a column
   * The column cells must be single values
   * The ordering applies after the grouping
   */
  @Prop() orderBy?: string;

  /**
   * Filter rows based on the presence of one or more values in a given column
   * The filtering will be based on cell label or id
   * Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx"
   */
  @Prop() filterBy?: string;

  /**
   * Used to hide specific column of the table
   */
  @Prop() hideColumns?: string;

  /**
   * Comma-separated list of reference prefixes to filter include
   */
  @Prop() filterReference = "PMID:,DOI:,GO_REF:,Reactome:";

  /**
   * If true, will exclude the protein binding GO term (GO:0005515) from the table
   */
  @Prop() excludeProteinBinding = true;

  @Watch("groupBy")
  @Watch("orderBy")
  @Watch("filterBy")
  @Watch("hideColumns")
  @Watch("filterReference")
  @Watch("excludeProteinBinding")
  regenerateDisplayTable() {
    this.produceDisplayTable();
  }

  @Watch("subjects")
  @Watch("slims")
  async refetchData() {
    if (this.dataManuallySet) {
      return;
    }
    await this.fetchData();
  }

  async componentWillLoad() {
    await dbxrefs.init();
    void this.fetchData();
  }

  @Method()
  async setData(data?: TableData) {
    this.dataManuallySet = true;
    this.tableData = data;
    if (data) {
      this.produceDisplayTable();
    } else {
      this.displayTable = undefined;
    }
  }

  private async fetchData() {
    if (!this.subjects || !this.slims) {
      return;
    }

    try {
      this.loading = true;
      this.loadingError = false;
      this.tableData = await getTableData(
        this.apiEndpoint,
        this.subjects,
        this.slims,
      );
      this.produceDisplayTable();
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loadingError = true;
    } finally {
      this.loading = false;
    }
  }

  private produceDisplayTable() {
    if (!this.tableData) {
      return;
    }

    const filteredData = produce(this.tableData, (draft: Draft<TableData>) => {
      if (this.filterReference) {
        this.applyFilterReference(draft);
      }
      if (this.excludeProteinBinding) {
        this.applyFilterPB(draft);
      }
    });

    const displayTable = bioLinkToTable(filteredData, dbxrefs.getURL);

    addEmptyCells(displayTable);

    // group the table rows based on provided columns (if any)
    if (this.groupBy) {
      const steps = this.groupBy.split(";");
      for (const groups of steps) {
        this.groupByColumns(displayTable, groups.split(","));
      }
    }

    // order the table rows based on provided columns (if any)
    if (this.orderBy) {
      displayTable.rows.sort((a, b) => {
        const eqa = a.cells.filter((elt) => elt.headerId == this.orderBy)[0];
        const eqb = b.cells.filter((elt) => elt.headerId == this.orderBy)[0];
        return eqa.values[0].label.localeCompare(eqb.values[0].label);
      });
    }

    // filter the table based on provided {col, values} (if any)
    if (this.filterBy) {
      const steps = this.filterBy.split(";");
      for (const filters of steps) {
        this.filterByColumns(displayTable, filters);
      }
    }

    // hide columns based on provided hideColumns parameter
    if (this.hideColumns) {
      const cols = this.hideColumns.split(",");
      for (const header of displayTable.header) {
        header.hide = cols.includes(header.id);
      }
    }
    this.displayTable = Object.freeze(displayTable);

    const map = new Map<string, Immutable<IHeaderCell>>();
    for (const header of this.displayTable.header) {
      map.set(header.id, header);
    }
    this.headerMap = map;
  }

  /**
   * Will group the table rows based on unique values in specified columns
   * @param table the table to be grouped
   * @param keyColumns ids of the columns to create unique rows - will only work with cells containing single value, not array
   */
  private groupByColumns(table: ITable, keyColumns: string[]) {
    const firstRow = table.rows[0].cells;
    const otherCells = firstRow.filter(
      (elt) => !keyColumns.includes(elt.headerId),
    );
    const otherColumns = otherCells.map((elt) => elt.headerId);

    // building the list of unique rows
    const uRows = new Map();
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      const keyCells = row.cells.filter((elt) =>
        keyColumns.includes(elt.headerId),
      );
      const key = keyCells.map((elt) => elt.values[0].label).join("-");

      let rows = [];
      if (uRows.has(key)) {
        rows = uRows.get(key);
      } else {
        uRows.set(key, rows);
      }
      rows.push(row);
    }

    const newRows = [];

    // this was required either by stenciljs or web component
    // for an integration in alliance REACT project
    // somehow more recent iterators on Map were not working !
    const akeys = Array.from(uRows.keys());

    // going through each set of unique rows
    // for(let rrows of uRows.values()) {
    for (let i = 0; i < akeys.length; i++) {
      const key = akeys[i];
      const rrows = uRows.get(key);
      const row = { cells: [] };
      for (const header of table.header) {
        let eqcell: ISuperCell = undefined;
        if (keyColumns.includes(header.id)) {
          eqcell = rrows[0].cells.filter((elt) => elt.headerId == header.id)[0];
        } else if (otherColumns.includes(header.id)) {
          eqcell = {
            headerId: header.id,
            values: [],
          };

          for (const eqrow of rrows) {
            const otherCell = eqrow.cells.filter(
              (elt) => elt.headerId == header.id,
            )[0];
            eqcell.headerId = otherCell.headerId;
            eqcell.id = otherCell.id;
            eqcell.clickable = otherCell.clickable;
            eqcell.foldable = otherCell.foldable;
            eqcell.selectable = otherCell.selectable;

            for (const val of otherCell.values) {
              eqcell.values.push(val);
            }
          }
        }

        if (eqcell) {
          row.cells.push(eqcell);
        }
      }
      newRows.push(row);
    }
    table.rows = newRows;
  }

  private filterByColumns(table: ITable, filters: string) {
    const split = filters.split(":");
    const key = split[0];
    const values = split[1].split(",");

    table.rows = table.rows.filter((row) => {
      const eqcell = row.cells.filter((elt) => {
        return elt.headerId == key;
      })[0];
      const hasValue = eqcell.values.some((elt) => {
        // return (elt.label && values.includes(elt.label)) || (elt.id && values.includes(elt.id));
        return (
          (elt.label && values.some((val) => elt.label.includes(val))) ||
          (elt.id && values.some((val) => elt.id.includes(val)))
        );
      });
      return hasValue;
    });
  }

  private applyFilterReference(data: TableData) {
    const filters = this.filterReference.split(",");

    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter((assoc) => {
        assoc.reference = assoc.reference.filter((ref) =>
          filters.some((filter) => ref.includes(filter)),
        );
        return assoc;
      });
    }
  }

  private applyFilterPB(data: TableData) {
    for (let i = 0; i < data.length; i++) {
      data[i].assocs = data[i].assocs.filter(
        (assoc) => assoc.object.id != "GO:0005515",
      );
    }
  }

  render() {
    if (!this.displayTable) {
      return null;
    }

    return (
      <table class="table" part="table">
        {this.renderHeader(this.displayTable)}
        {this.renderRows(this.displayTable)}
      </table>
    );
  }

  renderHeader(table: Immutable<ITable>) {
    return (
      <tr class="header">
        {table.header.map((cell) => {
          return (
            !cell.hide && (
              <th
                title={cell.description}
                id={cell.id}
                key={cell.id}
                class="header-cell"
              >
                {cell.label}
              </th>
            )
          );
        })}
      </tr>
    );
  }

  renderRows(table: Immutable<ITable>) {
    return table.rows.map((row) => (
      <tr class="row">
        {row.cells.map((superCell) => {
          if (!this.headerMap) {
            return null;
          }
          const header = this.headerMap.get(superCell.headerId);
          if (header.hide) {
            return null;
          }

          const baseURL = header.baseURL || "";

          return (
            <td class="supercell">
              <ul class="supercell-list">
                {
                  // Todo: this is where we can have a strategy for folding cells
                  superCell.values.map((cell) => {
                    let url = cell.url;
                    if (url && baseURL.length > 0) {
                      url = baseURL + url.replace(baseURL, "");
                    }

                    // create tags if any
                    let tag_span = "";
                    if (cell.tags) {
                      tag_span = (
                        <span class="tags">{cell.tags.join(", ")}</span>
                      );
                    }

                    return [
                      <li title={cell.description} class="supercell-list-item">
                        {cell.url ? (
                          <a
                            href={url}
                            target={table.newTab ? "_blank" : "_self"}
                          >
                            {tag_span} {cell.label}
                          </a>
                        ) : (
                          <div>
                            {tag_span} {cell.label}
                          </div>
                        )}
                      </li>,
                    ];
                  })
                }
              </ul>
            </td>
          );
        })}
      </tr>
    ));
  }
}
