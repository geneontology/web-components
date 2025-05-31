import { Component, Prop, h, Host } from "@stencil/core";

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
