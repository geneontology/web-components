import { render, h } from "@stencil/vitest";
import { describe, expect, it, vi } from "vitest";

import { TableData } from "../../globals/models";

vi.mock("@geneontology/dbxrefs", () => ({
  init: vi.fn().mockResolvedValue(undefined),
  getURL: vi.fn((db: string, _type: string | undefined, id: string) => {
    return `https://example.org/${db}/${id}`;
  }),
}));

const mockTableData: TableData = [
  {
    subject: "MGI:107461",
    slim: "GO:0009987",
    assocs: [
      {
        id: "assoc-1",
        subject: {
          id: "MGI:107461",
          iri: "",
          label: "Pax6",
          category: ["gene"],
          taxon: {
            id: "NCBITaxon:10090",
            iri: "",
            label: "Mus musculus",
          },
        },
        object: {
          id: "GO:0009987",
          iri: "",
          label: "cellular process",
          category: ["biological_process"],
          taxon: {
            id: "NCBITaxon:1",
            iri: "",
            label: "root",
          },
        },
        negated: false,
        qualifiers: ["acts_upstream_of"],
        evidence: "ECO:0000315",
        evidence_label: "Inferred from mutant phenotype",
        evidence_type: "IMP",
        evidence_with: ["UniProtKB:P12345"],
        reference: ["PMID:12345"],
      },
    ],
  },
];

describe("go-annotation-ribbon-table", () => {
  it("renders headers and table rows from manually provided data", async () => {
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonTableElement>(
        <go-annotation-ribbon-table
          hideColumns="qualifier"
          excludeProteinBinding={false}
        />,
      );

    await root.setData(mockTableData);
    await waitForChanges();

    const headers = Array.from(root.shadowRoot?.querySelectorAll("th") ?? []).map(
      (header) => header.textContent?.trim(),
    );
    expect(headers).toContain("Aspect");
    expect(headers).toContain("Gene");
    expect(headers).toContain("Term");
    expect(headers).not.toContain("Qualifier");

    const links = Array.from(root.shadowRoot?.querySelectorAll("a") ?? []).map(
      (link) => link.getAttribute("href"),
    );
    expect(links).toContain(
      "http://amigo.geneontology.org/amigo/gene_product/MGI:107461",
    );
    expect(links).toContain("http://amigo.geneontology.org/amigo/term/GO:0009987");
    expect(root.shadowRoot?.textContent).toContain("Pax6");
    expect(root.shadowRoot?.textContent).toContain("cellular process");
  });
});
