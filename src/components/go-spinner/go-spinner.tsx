import { Component, Prop, h, Host } from "@stencil/core";

@Component({
  tag: "wc-spinner",
  styleUrl: "go-spinner.css",
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
