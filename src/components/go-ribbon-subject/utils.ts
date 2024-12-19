export function formatTaxonLabel(species) {
  let split = species.split(" ");
  return split[0].substring(0, 1) + split[1].substring(0, 2);
}
