import { FunctionalComponent, h } from "@stencil/core";
import { RibbonGroup, RibbonSubject } from "../../../globals/models";
import { getNbAnnotations, getNbClasses } from "../utils";
import clsx from "clsx";

interface CellProps {
  subject: RibbonSubject;
  group: RibbonGroup;
  selected: boolean;
  hovered: boolean;
  getColor: (nbClasses: number, nbAnnotations: number) => string;
  onClick?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  key?: string;
}

export const Cell: FunctionalComponent<CellProps> = ({
  subject,
  group,
  selected,
  hovered,
  getColor,
  ...rest
}) => {
  const classes: Record<string, boolean> = {
    cell: true,
  };

  let title = "";
  let numClasses = 0;
  let numAnnotations = 0;

  const groupKey = group.id + (group.type === "Other" ? "-other" : "");
  const subjectGroup = subject.groups[groupKey];

  // by default the group should be available
  let available = true;
  // if a value was given, then override the default value
  if (subjectGroup && subjectGroup.available !== undefined) {
    available = subjectGroup.available;
  }

  if (available) {
    numClasses = getNbClasses(group, subject);
    numAnnotations = getNbAnnotations(group, subject);
    title = `Subject: ${subject.id}: ${subject.label}\n\nGroup: ${group.id}: ${group.label}\n\n`;

    if (numAnnotations > 0) {
      title +=
        `${numClasses} ${numClasses === 1 ? "term" : "terms"}, ` +
        `${numAnnotations} ${numAnnotations === 1 ? "annotation" : "annotations"}`;
    } else {
      title += "No data available";
    }

    classes["no-annotations"] = numAnnotations === 0;
    classes["selected"] = selected && numAnnotations > 0;
    classes["hovered"] = hovered && numAnnotations > 0;
  } else {
    title = `${subject.label} cannot have data for ${group.label}`;
    classes.unavailable = true;
  }
  const color = getColor(numClasses, numAnnotations);
  return (
    <td>
      <div
        class={clsx(classes)}
        style={{ backgroundColor: color }}
        title={title}
        {...rest}
      />
    </td>
  );
};
