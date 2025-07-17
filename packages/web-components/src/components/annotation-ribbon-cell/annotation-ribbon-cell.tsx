import { Component, h, Prop, Watch } from "@stencil/core";
import clsx from "clsx";

import { darken, heatColor } from "./utils";
import {
  getNbAnnotations,
  getNbClasses,
} from "../annotation-ribbon-strips/utils";

import {
  ColorByOption,
  IRibbonGroup,
  IRibbonSubject,
} from "../../globals/models";

/**
 * An individual cell in the annotation ribbon.
 *
 * @internal
 */
@Component({
  tag: "go-annotation-ribbon-cell",
  styleUrl: "annotation-ribbon-cell.scss",
  shadow: true,
})
export class AnnotationRibbonCell {
  @Prop() subject: IRibbonSubject;
  @Prop() group: IRibbonGroup;

  @Prop() classLabels = "term,terms";
  @Prop() annotationLabels = "annotation,annotations";
  @Prop() colorBy: ColorByOption = "annotations";
  @Prop() binaryColor = false;
  @Prop() minColor = "255,255,255";
  @Prop() maxColor = "24,73,180";
  @Prop() maxHeatLevel = 48;

  arrayMinColor;
  arrayMaxColor;

  @Watch("minColor")
  minColorChanged(newValue, oldValue) {
    if (newValue != oldValue) this.updateMinColor(newValue);
  }
  updateMinColor(newValue) {
    if (newValue instanceof Array) {
      this.arrayMinColor = newValue;
    } else if (newValue.includes(",")) {
      this.arrayMinColor = newValue.split(",");
    }
    this.arrayMinColor = this.arrayMinColor.map((elt) => +elt);
  }

  @Watch("maxColor")
  maxColorChanged(newValue, oldValue) {
    if (newValue != oldValue) this.updateMaxColor(newValue);
  }
  updateMaxColor(newValue) {
    if (newValue instanceof Array) {
      this.arrayMaxColor = newValue;
    } else if (newValue.includes(",")) {
      this.arrayMaxColor = newValue.split(",");
    }
    this.arrayMaxColor = this.arrayMaxColor.map((elt) => +elt);
  }

  arrayAnnotationLabels;
  arrayClassLabels;

  @Watch("annotationLabels")
  annotationLabelsChanged(newValue, oldValue) {
    if (newValue != oldValue) this.updateAnnotationLabels(newValue);
  }
  updateAnnotationLabels(newValue) {
    if (newValue instanceof Array) {
      this.arrayAnnotationLabels = newValue;
    } else if (newValue.includes(",")) {
      this.arrayAnnotationLabels = newValue.split(",");
    }
    this.arrayAnnotationLabels = this.arrayAnnotationLabels.map((elt) =>
      elt.trim(),
    );
  }

  @Watch("classLabels")
  classLabelsChanged(newValue, oldValue) {
    if (newValue != oldValue) this.updateClassLabels(newValue);
  }
  updateClassLabels(newValue) {
    if (newValue instanceof Array) {
      this.arrayClassLabels = newValue;
    } else if (newValue.includes(",")) {
      this.arrayClassLabels = newValue.split(",");
    }
    this.arrayClassLabels = this.arrayClassLabels.map((elt) => elt.trim());
  }

  /**
   * If set to true, won't show any color and can not be hovered or selected
   * This is used for group that can not have annotation for a given subject
   */
  @Prop() available = true;
  @Prop() selected = false;
  @Prop() hovered = false;

  private cellColor(nbClasses: number, nbAnnotations: number) {
    const levels = this.colorBy == "classes" ? nbClasses : nbAnnotations;
    let newColor = heatColor(
      levels,
      this.maxHeatLevel,
      this.arrayMinColor,
      this.arrayMaxColor,
      this.binaryColor,
    );
    if (this.hovered) {
      const tmp = newColor.replace(/[^\d,]/g, "").split(",");
      const val = darken(tmp, 0.4);
      newColor = "rgb(" + val.join(",") + ")";
    }
    return newColor;
  }

  /**
   * This is executed once when the component gets loaded
   */
  componentWillLoad() {
    this.updateMinColor(this.minColor);
    this.updateMaxColor(this.maxColor);
    this.updateAnnotationLabels(this.annotationLabels);
    this.updateClassLabels(this.classLabels);
  }

  render() {
    let title = "";
    const classes: (string | boolean)[] = ["cell"];

    let nbAnnotations = 0;
    let nbClasses = 0;
    if (!this.available) {
      title = this.subject.label + " can not have data for " + this.group.label;
      classes.push("unavailable");
    } else {
      nbClasses = getNbClasses(this.group, this.subject);
      nbAnnotations = getNbAnnotations(this.group, this.subject);

      title =
        "Subject: " +
        this.subject.id +
        ":" +
        this.subject.label +
        "\n\nGroup: " +
        this.group.id +
        ": " +
        this.group.label;

      if (nbAnnotations > 0) {
        title +=
          "\n\n" +
          nbClasses +
          " " +
          (nbClasses > 1
            ? this.arrayClassLabels[1]
            : this.arrayClassLabels[0]) +
          ", " +
          nbAnnotations +
          " " +
          (nbAnnotations > 1
            ? this.arrayAnnotationLabels[1]
            : this.arrayAnnotationLabels[0]);
      } else {
        title += "\n\nNo data available";
      }

      classes.push(
        nbAnnotations === 0 && "no-annotations",
        this.selected && nbAnnotations > 0 && "selected",
        this.hovered && nbAnnotations > 0 && "hovered",
      );
    }
    return (
      <div
        title={title}
        class={clsx(classes)}
        style={{ backgroundColor: this.cellColor(nbClasses, nbAnnotations) }}
      />
    );
  }
}
