import { RibbonGroup, RibbonSubject } from "../../globals/models";

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

export function groupKey(group: RibbonGroup) {
  return `category-${transformID(group.id)}-${group.type}`;
}

export function cellKey(subject: RibbonSubject, group: RibbonGroup) {
  return `subject-${transformID(subject.id)}-${groupKey(group)}`;
}

export function getNbClasses(group: RibbonGroup, subject: RibbonSubject) {
  if (group.type == "GlobalAll") {
    return subject.nb_classes;
  }
  const cellid = group.id + (group.type === "Other" ? "-other" : "");
  const cell = cellid in subject.groups ? subject.groups[cellid] : undefined;
  return cell ? cell["ALL"]["nb_classes"] : 0;
}

export function getNbAnnotations(group: RibbonGroup, subject: RibbonSubject) {
  if (group.type == "GlobalAll") {
    return subject.nb_annotations;
  }
  const cellid = group.id + (group.type === "Other" ? "-other" : "");
  const cell = cellid in subject.groups ? subject.groups[cellid] : undefined;
  return cell ? cell["ALL"]["nb_annotations"] : 0;
}
