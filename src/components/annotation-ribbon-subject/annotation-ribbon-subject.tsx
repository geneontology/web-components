import { h } from "@stencil/core";

import { Component, Prop, State, Element } from "@stencil/core";

import { formatTaxonLabel } from "./utils";
import { EventEmitter, Event } from "@stencil/core";
import { IRibbonSubject } from "../../globals/models";

@Component({
  tag: "go-annotation-ribbon-subject",
  styleUrl: "annotation-ribbon-subject.scss",
  shadow: false,
})
export class AnnotationRibbonSubject {
  @Element() el: HTMLElement;

  @Prop() subject: IRibbonSubject;

  @Prop() subjectBaseURL: string;
  @Prop() newTab: boolean;

  @State() id: string;

  constructor() {
    if (!this.subjectBaseURL.endsWith("/")) {
      this.subjectBaseURL += "/";
    }
    // fix due to doubling MGI:MGI: in GO
    this.id = this.subject.id;
    if (this.subject.id.startsWith("MGI:")) {
      this.id = "MGI:" + this.subject.id;
    }
  }

  /**
   * This event is triggered whenever a subject label is clicked
   * Can call preventDefault() to avoid the default behavior (opening the linked subject page)
   */
  @Event({ eventName: "subjectClick", cancelable: true, bubbles: true })
  subjectClick: EventEmitter;

  onSubjectClick(event, subject) {
    const ev = { originalEvent: event, subject: subject };
    this.subjectClick.emit(ev);
  }

  render() {
    return (
      <td>
        <a
          class="ribbon__subject__label--link"
          href={this.subjectBaseURL + this.id}
          onClick={(e) => {
            this.onSubjectClick(e, this.subject);
          }}
          target={this.newTab ? "_blank" : "_self"}
        >
          {this.subject.label +
            " (" +
            formatTaxonLabel(this.subject.taxon_label) +
            ")"}
        </a>
      </td>
    );
  }
}
