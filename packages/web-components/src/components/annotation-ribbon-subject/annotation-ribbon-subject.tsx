import { Component, Event, EventEmitter, h, Prop, Watch } from "@stencil/core";

import { formatTaxonLabel } from "./utils";
import { IRibbonSubject } from "../../globals/models";

/**
 * An individual subject in the annotation ribbon.
 *
 * @internal
 */
@Component({
  tag: "go-annotation-ribbon-subject",
  styleUrl: "annotation-ribbon-subject.scss",
  shadow: true,
})
export class AnnotationRibbonSubject {
  private subjectId: string;
  private subjectBaseURLFull: string = "/";

  @Prop() subject!: IRibbonSubject;

  @Prop()
  get subjectBaseURL(): string {
    return this.subjectBaseURLFull;
  }
  set subjectBaseURL(value: string) {
    let newValue = value;
    if (!newValue.endsWith("/")) {
      newValue += "/";
    }
    this.subjectBaseURLFull = newValue;
  }

  @Prop() newTab: boolean = true;

  @Watch("subject")
  subjectChanged() {
    // fix due to doubling MGI:MGI: in GO
    this.subjectId = this.subject.id;
    if (this.subjectId.startsWith("MGI:")) {
      this.subjectId = "MGI:" + this.subject.id;
    }
  }

  async componentDidLoad() {
    this.subjectChanged();
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
      <a
        class="label"
        href={this.subjectBaseURL + this.subjectId}
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
    );
  }
}
