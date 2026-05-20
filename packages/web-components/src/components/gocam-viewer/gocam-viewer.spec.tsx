import { render, h } from "@stencil/vitest";
import { describe, expect, it, vi } from "vitest";

vi.mock("@geneontology/dbxrefs", () => ({
  init: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("cytoscape", () => {
  const cytoscape = Object.assign(vi.fn(), {
    use: vi.fn(),
  });
  return { default: cytoscape };
});

vi.mock("cytoscape-dagre", () => ({
  default: {},
}));

describe("go-gocam-viewer", () => {
  it("renders the viewer shell without the optional legend", async () => {
    const { root } = await render(<go-gocam-viewer showLegend={false} />);

    expect(root.shadowRoot?.textContent).toContain("Processes and Activities");
    expect(root.shadowRoot?.textContent).toContain("Reset View");
    expect(
      root.shadowRoot?.querySelector("go-gocam-viewer-sidebar"),
    ).not.toBeNull();
    expect(root.shadowRoot?.querySelector("go-gocam-viewer-legend")).toBeNull();
  });
});
