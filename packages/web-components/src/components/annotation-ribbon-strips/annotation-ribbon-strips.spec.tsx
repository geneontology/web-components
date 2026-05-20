import { render, h } from "@stencil/vitest";
import { describe, expect, it } from "vitest";

import { RibbonData, RibbonSubjectGroupCounts } from "../../globals/models";

const subjectGroupCounts: RibbonSubjectGroupCounts = {
  ALL: {
    nb_annotations: 3,
    nb_classes: 2,
  },
};
subjectGroupCounts.available = true;

const mockRibbonData: RibbonData = {
  categories: [
    {
      id: "GO:0008150",
      label: "Biological Process",
      description: "Biological process category",
      groups: [
        {
          id: "GO:0009987",
          label: "cellular process",
          description: "cellular process",
          type: "Term",
        },
      ],
    },
  ],
  subjects: [
    {
      id: "MGI:107461",
      label: "Pax6",
      taxon_id: "NCBITaxon:10090",
      taxon_label: "Mus musculus",
      nb_annotations: 3,
      nb_classes: 2,
      groups: {
        "GO:0009987": subjectGroupCounts,
      },
    },
  ],
};

describe("go-annotation-ribbon-strips", () => {
  it("renders subject rows and group headers for provided data", async () => {
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonStripsElement>(
        <go-annotation-ribbon-strips showAllAnnotationsGroup={true} />,
      );

    await root.setData(mockRibbonData);
    await waitForChanges();

    expect(root.shadowRoot?.textContent).toContain("all annotations");
    expect(root.shadowRoot?.textContent).toContain("cellular process");
    expect(root.shadowRoot?.querySelectorAll(".cell").length).toBeGreaterThan(
      0,
    );

    const subject =
      root.shadowRoot?.querySelector<HTMLGoAnnotationRibbonSubjectElement>(
        "go-annotation-ribbon-subject",
      );
    expect(subject).not.toBeNull();
    expect(subject?.subjectBaseURL).toBe(
      "https://amigo.geneontology.org/amigo/gene_product/",
    );
  });
});
