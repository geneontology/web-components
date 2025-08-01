# Upgrading to v1

Previous versions of the Gene Ontology Web Components were managed as separate packages. Starting with v1 of this package, all components are now bundled together in a single package. This simplifies installation and usage, allowing you to import all components from a single package instead of managing multiple dependencies.

## Updating Dependencies

Previously, you may have had one or more of the following packages installed:

- `@geneontology/wc-gocam-viz`
- `@geneontology/wc-go-ribbon`
- `@geneontology/wc-ribbon-strips`
- `@geneontology/wc-ribbon-table`

To upgrade to v1, you should remove these packages and install the new unified package: `@geneontology/web-components`. See the [installation guide](../getting-started/install) for more details.

## New Custom Element Names

In v1, the custom element names have been standardized to follow a consistent naming convention. Replace the following old custom element names with the new ones:

| Previous Element Name | New Element Name              |
| --------------------- | ----------------------------- |
| `wc-gocam-viz`        | `go-gocam-viewer`             |
| `wc-gocam-legend`     | `go-gocam-viewer-legend`      |
| `wc-go-ribbon`        | `go-annotation-ribbon`        |
| `wc-ribbon-strips`    | `go-annotation-ribbon-strips` |
| `wc-ribbon-table`     | `go-annotation-ribbon-table`  |

## Annotation Ribbon API Changes

The `go-annotation-ribbon` component has undergone several API changes. Some attributes have been renamed, modified, or removed. Below is a summary of the changes:

| Previous Attribute Name     | New Attribute/Migration Path                                                                                                                                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add-cell-all`              | Renamed `show-all-annotations-group`.                                                                                                                                                                                                                                                               |
| `annotation-labels`         | Removed, no longer configurable.                                                                                                                                                                                                                                                                    |
| `base-api-url`              | Renamed `ribbon-data-api-endpoint`.                                                                                                                                                                                                                                                                 |
| `category-all-style`        | Replaced by `--group-all-font-weight` CSS custom property.                                                                                                                                                                                                                                          |
| `category-case`             | Replaced by `--group-text-transform` CSS custom property.                                                                                                                                                                                                                                           |
| `category-other-style`      | Replaced by `--group-other-font-weight` CSS custom property.                                                                                                                                                                                                                                        |
| `class-labels`              | Removed, no longer configurable.                                                                                                                                                                                                                                                                    |
| `color-by`                  | Now accepts strings (`"annotations"` or `"classes"`) instead of integers (`0` or `1`).                                                                                                                                                                                                              |
| `data`                      | Removed, use `setData()` method instead.                                                                                                                                                                                                                                                            |
| `exclude-p-b`               | Renamed `exclude-protein-binding`.                                                                                                                                                                                                                                                                  |
| `fire-event-on-empty-cells` | Removed, previously had inconsistent behavior.                                                                                                                                                                                                                                                      |
| `group-base-url`            | Removed, previously unimplemented.                                                                                                                                                                                                                                                                  |
| `group-new-tab`             | Removed, previously unimplemented.                                                                                                                                                                                                                                                                  |
| `max-color`                 | Previously accepted a string that was implicitly an RGB triple (e.g. `"255,0,0"` for red). Now accepts a [CSS color string](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#syntax). Existing usage can be migrated by wrapping the string in `rgb()` (e.g. `"rgb(255,0,0)"` for red). |
| `max-heat-level`            | Renamed `max-color-level`. This property now directly determines at which number of classes or annotations the `max-color` is applied. It also now allows the value `0` (the default) to indicate that the value should be automatically determined from the data.                                  |
| `min-color`                 | Previously accepted a string that was implicitly an RGB triple (e.g. `"255,0,0"` for red). Now accepts a [CSS color string](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#syntax). Existing usage can be migrated by wrapping the string in `rgb()` (e.g. `"rgb(255,0,0)"` for red). |
| `selection-mode`            | Now accepts strings (`"cell"` or `"column"`) instead of integers (`0` or `1`).                                                                                                                                                                                                                      |
| `subject-position`          | Now accepts strings (`"none"`, `"left"` or `"right"`) instead of integers (`0`, `1` or `2`). The "bottom" option (`3`) was removed because it was previously unimplemented.                                                                                                                         |
| `subject-use-taxon-icon`    | Removed, previously unimplemented.                                                                                                                                                                                                                                                                  |
