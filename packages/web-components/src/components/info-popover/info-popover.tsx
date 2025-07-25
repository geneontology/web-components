import { Component, h, Prop, State } from "@stencil/core";
import { Placement } from "../../globals/models";

import { version } from "../../../package.json";

/**
 * A popover component that displays information about the web components library.
 *
 * @internal
 */
@Component({
  tag: "go-info-popover",
  styleUrl: "info-popover.scss",
  shadow: true,
})
export class InfoPopover {
  @State() isOpen: boolean = false;

  @Prop() placement: Placement = "bottom-start";

  private handleTriggerClick = (event: MouseEvent) => {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  };

  render() {
    return (
      <div class="container">
        <buttton
          class="trigger"
          id="popover-trigger"
          onClick={this.handleTriggerClick}
          aria-label="Information about component library"
        >
          ?
        </buttton>
        {this.isOpen && (
          <div
            class={`popover ${this.placement}`}
            role="tooltip"
            aria-describedby="popover-trigger"
            aria-hidden={!this.isOpen ? "true" : "false"}
          >
            <a
              href="https://geneontology.github.io/web-components/"
              target="_blank"
              rel="noopener noreferrer"
              class="no-wrap"
            >
              @geneontology/web-components
            </a>
            <br />
            Version: {version}
          </div>
        )}
      </div>
    );
  }
}
