import { Component, h, Prop } from "@stencil/core";
import { HTTPError, TimeoutError } from "ky";

/**
 * A component that displays an error message when GO data fails to load.
 *
 * @internal
 */
@Component({
  tag: "go-data-load-error",
  styleUrl: "data-load-error.scss",
  shadow: true,
})
export class DataLoadError {
  @Prop() componentName: string;
  @Prop() error: Error;

  render() {
    let details = `Host page:   ${window.location.href}
Component:   ${this.componentName}`;
    if (this.error instanceof HTTPError || this.error instanceof TimeoutError) {
      details += `
API request: ${this.error.request.method} ${this.error.request.url}`;
    }
    return (
      <div class="error">
        <div class="error-header">
          <b>Failed to load GO data</b>
        </div>
        <div>
          <p>
            Please try again later. If the issue persists visit the{" "}
            <a
              href="https://help.geneontology.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GO Helpdesk
            </a>{" "}
            to report the problem. Include the following information in your
            report:
          </p>
          <pre>{details}</pre>
        </div>
      </div>
    );
  }
}
