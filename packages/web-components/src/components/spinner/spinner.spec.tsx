import { render, h } from "@stencil/vitest";
import { describe, it, expect } from "vitest";

describe("go-spinner", () => {
  it("renders a ring div", async () => {
    const { root } = await render(<go-spinner />);
    expect(root.shadowRoot.querySelector(".ring")).not.toBeNull();
  });

  it("renders with a message", async () => {
    const { root } = await render(<go-spinner message="Loading..." />);
    expect(root).toEqualText("Loading...");
  });
});
