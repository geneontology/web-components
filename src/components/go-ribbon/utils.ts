/**
 * Return the category object for a given group
 * @param {*} group group object (eg ontology term)
 */
export function getCategory(group, categories) {
  let cat = categories.filter((cat) => {
    return cat.groups.some((gp) => gp.id == group.id);
  });
  return cat.length > 0 ? cat[0] : undefined;
}

/**
 * Return the category [id, label] for a given group
 * @param {*} group group object (eg ontology term)
 */
export function getCategoryIdLabel(group, categories) {
  let cat = categories.filter((cat) => {
    return cat.groups.some((gp) => gp.id == group.id);
  });
  return cat.length > 0 ? [cat[0].id, cat[0].label] : undefined;
}

export function associationKey(assoc) {
  if (assoc.qualifier) {
    return (
      assoc.subject.id +
      "@" +
      assoc.object.id +
      "@" +
      assoc.negated +
      "@" +
      assoc.qualifier.join("-")
    );
  }
  return assoc.subject.id + "@" + assoc.object.id + "@" + assoc.negated;
}

export function fullAssociationKey(assoc) {
  var key =
    associationKey(assoc) +
    "@" +
    assoc.evidence_type +
    "@" +
    assoc.provided_by +
    "@" +
    assoc.reference.join("#");
  return key;
}

export function diffAssociations(assocs_all, assocs_exclude) {
  var list = [];
  for (let assoc of assocs_all) {
    let found = false;
    let key_all = fullAssociationKey(assoc);
    for (let exclude of assocs_exclude) {
      let key_exclude = fullAssociationKey(exclude);
      if (key_all == key_exclude) {
        found = true;
        break;
      }
    }
    if (!found) {
      list.push(assoc);
    }
  }
  return list;
}
