import { render, h } from "@stencil/vitest";
import { describe, it, expect } from "vitest";
import { RibbonSubject } from "../../globals/models";

describe("go-annotation-ribbon-subject", () => {
  const mockSubject: RibbonSubject = {
    id: "MGI:107461",
    label: "Pax6",
    taxon_id: "NCBITaxon:10090",
    taxon_label: "Mus musculus",
    nb_annotations: 10,
    nb_classes: 5,
    groups: {},
  };

  it("renders correctly with basic props", async () => {
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonSubjectElement>(
        <go-annotation-ribbon-subject subject={mockSubject} />,
      );

    // In @stencil/vitest, sometimes we need to ensure the component is properly initialized.
    // subjectId is a private member that is set in subjectChanged().
    // We can try to set the prop again to trigger the watch if initial render didn't.
    root.subject = { ...mockSubject };
    await waitForChanges();

    // Check label text (includes taxon label formatted)
    // formatTaxonLabel('Mus musculus') -> 'Mmu'
    expect(root.shadowRoot?.textContent).toContain("Pax6 (Mmu)");

    // Check default link
    const anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("/MGI:107461");
    expect(anchor?.getAttribute("target")).toBe("_blank");
  });

  it("prepends extra MGI: when subjectBaseURL is an AmiGO URL and subject starts with MGI:", async () => {
    const amigoURL = "http://amigo.geneontology.org/amigo/gene_product/";
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonSubjectElement>(
        <go-annotation-ribbon-subject
          subject={mockSubject}
          subjectBaseURL={amigoURL}
        />,
      );
    root.subject = { ...mockSubject };
    await waitForChanges();

    const anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(amigoURL + "MGI:MGI:107461");
  });

  it("does NOT prepend extra MGI: when subjectBaseURL is NOT an AmiGO URL", async () => {
    const allianceURL = "https://www.alliancegenome.org/gene/";
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonSubjectElement>(
        <go-annotation-ribbon-subject
          subject={mockSubject}
          subjectBaseURL={allianceURL}
        />,
      );
    root.subject = { ...mockSubject };
    await waitForChanges();

    const anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(allianceURL + "MGI:107461");
  });

  it("does NOT prepend extra MGI: if subject ID does not start with MGI: even on AmiGO", async () => {
    const otherSubject: RibbonSubject = {
      ...mockSubject,
      id: "RGD:620474",
      label: "Pax6",
    };
    const amigoURL = "http://amigo.geneontology.org/amigo/gene_product/";
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonSubjectElement>(
        <go-annotation-ribbon-subject
          subject={otherSubject}
          subjectBaseURL={amigoURL}
        />,
      );
    root.subject = { ...otherSubject };
    await waitForChanges();

    const anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(amigoURL + "RGD:620474");
  });

  it("respects the newTab prop", async () => {
    // Test with newTab = true (default)
    const { root, waitForChanges } =
      await render<HTMLGoAnnotationRibbonSubjectElement>(
        <go-annotation-ribbon-subject subject={mockSubject} newTab={true} />,
      );
    root.subject = { ...mockSubject };
    await waitForChanges();

    let anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("target")).toBe("_blank");

    // Test with newTab = false
    root.newTab = false;
    await waitForChanges();

    anchor = root.shadowRoot?.querySelector("a");
    expect(anchor?.getAttribute("target")).toBe("_self");
  });
});
