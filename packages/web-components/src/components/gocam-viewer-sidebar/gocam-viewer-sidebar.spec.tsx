import { render, h } from "@stencil/vitest";
import { describe, expect, it, vi } from "vitest";

const mockActivity = {
  id: "gomodel:12345/1",
  gpNode: {
    term: {
      url: "https://example.org/gene/Pax6",
      label: "Pax6",
    },
  },
  rootNode: {
    term: {
      url: "https://example.org/go/0003700",
      label: "DNA-binding transcription factor activity",
    },
    predicate: {
      evidence: [
        {
          reference: "PMID:12345",
          evidence: { label: "IMP" },
          referenceEntity: { url: "https://example.org/reference/12345" },
        },
      ],
    },
  },
  nodes: [
    {
      predicate: {
        edge: {
          id: "BFO:0000066",
          label: "occurs in",
        },
        evidence: [
          {
            reference: "PMID:12345",
            evidence: { label: "IMP" },
            referenceEntity: { url: "https://example.org/reference/12345" },
          },
        ],
      },
      term: {
        url: "https://example.org/go/0005634",
        label: "nucleus",
      },
    },
    {
      predicate: {
        edge: {
          id: "RO:0002333",
          label: "enabled by",
        },
        evidence: [],
      },
      term: {
        url: "https://example.org/go/0003674",
        label: "ignored node",
      },
    },
  ],
};

describe("go-gocam-viewer-sidebar", () => {
  it("renders grouped activities and emits a selection event", async () => {
    const mockCam = {
      groupActivitiesByProcess: () => ({
        "developmental process": [mockActivity],
      }),
    };
    const onSelectChanged = vi.fn();

    const { root, waitForChanges } =
      await render<HTMLGoGocamViewerSidebarElement>(
        <go-gocam-viewer-sidebar />,
      );
    root.addEventListener("selectChanged", onSelectChanged as EventListener);

    root.cam = mockCam as never;
    await waitForChanges();

    expect(root.shadowRoot?.textContent).toContain("developmental process");
    expect(root.shadowRoot?.textContent).toContain("Pax6");
    expect(root.shadowRoot?.textContent).toContain("nucleus");
    expect(root.shadowRoot?.textContent).not.toContain("ignored node");

    root.shadowRoot?.querySelector<HTMLElement>(".activity")?.click();
    await waitForChanges();

    expect(onSelectChanged).toHaveBeenCalledTimes(1);
    expect((onSelectChanged.mock.calls[0][0] as CustomEvent).detail).toBe(
      mockActivity,
    );
  });
});
