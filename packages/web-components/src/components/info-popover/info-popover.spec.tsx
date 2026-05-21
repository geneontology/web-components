import { render, h } from "@stencil/vitest";
import { describe, expect, it } from "vitest";

import { version } from "../../../package.json";

describe("go-info-popover", () => {
  it("opens the popover when the trigger is clicked", async () => {
    const { root, waitForChanges } = await render(
      <go-info-popover placement="bottom-end" />,
    );

    expect(root.shadowRoot?.querySelector("[role='tooltip']")).toBeNull();

    root.shadowRoot
      ?.querySelector<HTMLButtonElement>("#popover-trigger")
      ?.click();
    await waitForChanges();

    const tooltip = root.shadowRoot?.querySelector("[role='tooltip']");
    expect(tooltip?.className).toContain("bottom-end");
    expect(tooltip?.textContent).toContain("@geneontology/web-components");
    expect(tooltip?.textContent).toContain(version);
  });
});
