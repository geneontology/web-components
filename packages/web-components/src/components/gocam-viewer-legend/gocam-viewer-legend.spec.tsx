import { render, h } from "@stencil/vitest";
import { describe, expect, it } from "vitest";

describe("go-gocam-viewer-legend", () => {
  it("renders relation labels and SVG markers", async () => {
    const { root } = await render(<go-gocam-viewer-legend />);

    expect(root.shadowRoot?.textContent).toContain("Relation Types");
    expect(root.shadowRoot?.textContent).toContain("provides input for");
    expect(root.shadowRoot?.querySelectorAll("marker").length).toBeGreaterThan(0);
    expect(root.shadowRoot?.querySelectorAll(".section").length).toBe(3);
  });
});
