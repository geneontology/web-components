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
