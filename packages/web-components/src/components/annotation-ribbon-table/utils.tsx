import { DisplayTable, TableData } from "../../globals/models";
import { Immutable } from "immer";

/**
 * For table that have cells with multiple values
 * When merging rows based on such cells with multiple values, we have to fill with empty cells the columns that
 * don't contain as many element, so we'll keep the ordering and link between merged rows
 * Note: Should only be launched once on a table
 * @param table
 */
export function addEmptyCells(table: DisplayTable) {
  for (const row of table.rows) {
    let nbMax = 0;
    for (const header of table.header) {
      const eqcell = row.cells.filter((elt) => elt.headerId == header.id)[0];
      nbMax = Math.max(nbMax, eqcell.values.length);
    }
    for (const header of table.header) {
      const eqcell = row.cells.filter((elt) => elt.headerId == header.id)[0];
      while (eqcell.values.length < nbMax) {
        eqcell.values.push({ label: "" });
      }
    }
  }
}

export function aspectShortLabel(txt) {
  if (txt == "biological_process") {
    return "P";
  } else if (txt == "molecular_activity" || txt == "molecular_function") {
    return "F";
  } else if (txt == "cellular_component") {
    return "C";
  }
  return "U";
}

export function bioLinkToTable(
  data: Immutable<TableData>,
  getURL: (db: string, type: string | undefined, id: string) => string,
): DisplayTable {
  const table: DisplayTable = {
    newTab: true,
    header: [
      {
        label: "Aspect",
        id: "aspect",
        description:
          "High level category that gather multiple groups (eg ontology terms)",
      },
      {
        label: "Gene",
        id: "gene",
        description: "Gene or gene product",
        baseURL: "http://amigo.geneontology.org/amigo/gene_product/",
      },
      {
        label: "Qualifier",
        id: "qualifier",
        description:
          "Most often, describe if an entity (eg gene) has or has NOT a given feature (ontology term)",
      },
      {
        label: "Term",
        id: "term",
        description:
          "Ontology term used to describe a feature of the gene product",
        baseURL: "http://amigo.geneontology.org/amigo/term/",
      },
      {
        label: "Evidence",
        id: "evidence",
        description:
          "Type of evidence supporting that a given gene product has a certain feature (ontology term)",
        baseURL:
          "http://www.ontobee.org/ontology/ECO?iri=http://purl.obolibrary.org/obo/",
      },
      {
        label: "With/From",
        description:
          "In case of sequence similarity, is used to state from which gene product the feature (ontology term) was inferred",
        id: "with_from",
      },
      {
        label: "Reference",
        description:
          "Reference that support that a given gene product has a certain feature (ontology term)",
        id: "reference",
      },
    ],

    rows: [],
  };

  for (const subject of data) {
    for (const assoc of subject.assocs) {
      table.rows.push({
        cells: [
          {
            headerId: "aspect",
            values: [
              {
                label: aspectShortLabel(assoc.object.category[0]),
              },
            ],
          },

          {
            headerId: "gene",
            values: [
              {
                label: assoc.subject.label,
                url: assoc.subject.id,
              },
            ],
          },

          {
            headerId: "qualifier",
            values: assoc.qualifiers
              ? assoc.qualifiers.map((elt) => {
                  return {
                    label: elt,
                  };
                })
              : [{ label: "" }],
          },

          {
            headerId: "term",
            values: [
              {
                label: assoc.object.label,
                url: assoc.object.id,
                tags: assoc.qualifiers ? [...assoc.qualifiers] : undefined,
              },
            ],
          },

          {
            headerId: "evidence",
            values: [
              {
                label: assoc.evidence_type,
                description: assoc.evidence_label,
                url: assoc.evidence.replace(":", "_"),
              },
            ],
          },

          {
            headerId: "with_from",
            values: assoc.evidence_with
              ? assoc.evidence_with.map((elt) => {
                  return {
                    label: elt,
                    url: getURL(
                      elt.substring(0, elt.indexOf(":")),
                      undefined,
                      elt.substring(elt.indexOf(":") + 1),
                    ),
                  };
                })
              : [{ label: "" }],
          },

          {
            headerId: "reference",
            values: assoc.reference.map((elt) => {
              return {
                label: elt,
                url: getURL(
                  elt.substring(0, elt.indexOf(":")),
                  undefined,
                  elt.substring(elt.indexOf(":") + 1),
                ),
              };
            }),
          },
        ],
      });
    }
  }
  return table;
}
