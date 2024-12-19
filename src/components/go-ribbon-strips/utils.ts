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

export function groupKey(group) {
  return "category-" + transformID(group.id) + "-" + group.type;
}

export function subjectGroupKey(subject, group) {
  return (
    "subject-" +
    transformID(subject.id) +
    "-category-" +
    transformID(group.id) +
    "-" +
    group.type
  );
}

export function sameArray(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
