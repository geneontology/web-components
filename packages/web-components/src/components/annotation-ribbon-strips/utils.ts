import { IRibbonGroup, IRibbonSubject } from "../../globals/models";

export function truncate(text, size, ending) {
  if (size == null) {
    size = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (text.length > size) {
    return text.substring(0, size - ending.length) + ending;
  } else {
    return text;
  }
}

export function transformID(txt) {
  return txt.replace(":", "_");
}

export function groupKey(group: IRibbonGroup) {
  return `category-${transformID(group.id)}-${group.type}`;
}

export function cellKey(subject: IRibbonSubject, group: IRibbonGroup) {
  return `subject-${transformID(subject.id)}-${groupKey(group)}`;
}

export function getNbClasses(group: IRibbonGroup, subject: IRibbonSubject) {
  if (group.type == "GlobalAll") {
    return subject.nb_classes;
  }
  const cellid = group.id + (group.type === "Other" ? "-other" : "");
  const cell = cellid in subject.groups ? subject.groups[cellid] : undefined;
  return cell ? cell["ALL"]["nb_classes"] : 0;
}

export function getNbAnnotations(group: IRibbonGroup, subject: IRibbonSubject) {
  if (group.type == "GlobalAll") {
    return subject.nb_annotations;
  }
  const cellid = group.id + (group.type === "Other" ? "-other" : "");
  const cell = cellid in subject.groups ? subject.groups[cellid] : undefined;
  return cell ? cell["ALL"]["nb_annotations"] : 0;
}
