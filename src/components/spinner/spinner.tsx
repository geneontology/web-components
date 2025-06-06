import { Component, Prop, h, Host } from "@stencil/core";

/**
 * The Spinner component displays a loading spinner with an optional message.
 *
 * @internal
 */
@Component({
  tag: "go-spinner",
  styleUrl: "spinner.css",
  shadow: true,
})
export class Spinner {
  @Prop() message: string;

  render() {
    return (
      <Host>
        <div class="ring"></div>
        {this.message}
      </Host>
    );
  }
}
