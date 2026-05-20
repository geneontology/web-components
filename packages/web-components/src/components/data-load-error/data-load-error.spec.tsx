import { render, h } from "@stencil/vitest";
import { describe, expect, it } from "vitest";

describe("go-data-load-error", () => {
  it("renders the help text and diagnostic details", async () => {
    const error = new Error("Request failed");
    const { root } = await render(
      <go-data-load-error
        componentName="AnnotationRibbon"
        error={error}
      />,
    );

    expect(root.shadowRoot?.textContent).toContain("Failed to load GO data");
    expect(root.shadowRoot?.textContent).toContain("AnnotationRibbon");

    const helpLink = root.shadowRoot?.querySelector("a");
    expect(helpLink?.getAttribute("href")).toBe(
      "https://help.geneontology.org/",
    );

    const details = root.shadowRoot?.querySelector("pre")?.textContent ?? "";
    expect(details).toContain("Component:   AnnotationRibbon");
    expect(details).toContain(window.location.href);
  });
});
