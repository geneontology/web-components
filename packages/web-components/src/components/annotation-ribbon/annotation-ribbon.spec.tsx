import { render, h } from "@stencil/vitest";
import { describe, expect, it } from "vitest";

describe("go-annotation-ribbon", () => {
  it("renders the ribbon strips and table containers", async () => {
    const { root } = await render(<go-annotation-ribbon />);

    expect(
      root.shadowRoot?.querySelector("go-annotation-ribbon-strips"),
    ).not.toBeNull();
    expect(
      root.shadowRoot?.querySelector("go-annotation-ribbon-table"),
    ).not.toBeNull();
    expect(root.shadowRoot?.querySelector("go-spinner")).toBeNull();
  });
});
