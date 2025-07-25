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

  private handleTriggerClick(event: MouseEvent) {
    console.log("click", this.isOpen);
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }

  render() {
    return (
      <div class="container">
        <div class="trigger" onClick={(e) => this.handleTriggerClick(e)}>
          ?
        </div>
        {this.isOpen && (
          <div class={`popover ${this.placement}`}>
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
