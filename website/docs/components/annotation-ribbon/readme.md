# go-annotation-ribbon

<!-- Auto Generated Below -->

## Overview

The Annotation Ribbon component summarizes [GO annotation](https://geneontology.org/docs/go-annotations/)
as a grid of cells. Each row in the grid (called "strips") represents a subject (typically a
gene), and each column represents a GO term. The color of each cell indicates the relative number
of GO annotations for that subject to the term or one of its descendants in the ontology
hierarchy. The columns are additionally grouped into categories which are visually separated in
the display.

When a cell is clicked, a table of annotations is displayed below the strips. The table shows the
details of the annotations for the selected subject and term.

For advanced use cases, the individual components of the ribbon can be used separately:
[strips](./annotation-ribbon-strips), [table](./annotation-ribbon-table).

## Usage

### Basic Usage

```html
<go-annotation-ribbon subjects="RGD:620474,RGD:3889"></go-annotation-ribbon>
```

[//]: # "TODO: Add a live demo here when it uses shadow DOM"

<div class="demo-container">
  <go-annotation-ribbon subjects="RGD:620474,RGD:3889"></go-annotation-ribbon>
</div>

## Properties

| Property                  | Attribute                    | Description                                                                                                                                                                                                                                                              | Type                          | Default                                                            |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------ |
| `binaryColor`             | `binary-color`               | If `true`, show only two colors (`minColor` and `maxColor`) to indicate the values of a cell. Otherwise, the color of a cell will be interpolated between `minColor` and `maxColor` based on the number of annotations or classes.                                       | `boolean`                     | `false`                                                            |
| `colorBy`                 | `color-by`                   | Whether to color cells by annotations or classes.                                                                                                                                                                                                                        | `"annotations" \| "classes"`  | `"annotations"`                                                    |
| `colorScaleExponent`      | `color-scale-exponent`       | Exponent used to scale the color interpolation. A value of 1 will make the scale linear. Values less than 1 will make the color scale more sensitive to smaller values, while values greater than 1 will make it more sensitive to larger values.                        | `number`                      | `0.25`                                                             |
| `excludeProteinBinding`   | `exclude-protein-binding`    | If true, will exclude the protein binding GO term (GO:0005515) from the table                                                                                                                                                                                            | `boolean`                     | `true`                                                             |
| `filterBy`                | `filter-by`                  | Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx" Note: if value is "", remove any filtering    | `string`                      | `undefined`                                                        |
| `filterCrossAspect`       | `filter-cross-aspect`        | If true, the table will filter out associations that are cross-aspect                                                                                                                                                                                                    | `boolean`                     | `true`                                                             |
| `filterReference`         | `filter-reference`           | Comma-separated list of reference prefixes to filter include                                                                                                                                                                                                             | `string`                      | `"PMID:,DOI:,GO_REF:,Reactome:"`                                   |
| `groupBy`                 | `group-by`                   | Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping | `string`                      | `"term,qualifier"`                                                 |
| `groupClickable`          | `group-clickable`            | If `true`, the group labels are clickable and will trigger the `groupClick` event                                                                                                                                                                                        | `boolean`                     | `true`                                                             |
| `groupMaxLabelSize`       | `group-max-label-size`       | Maximum size of group labels in characters.                                                                                                                                                                                                                              | `number`                      | `60`                                                               |
| `hideColumns`             | `hide-columns`               | Used to hide specific column of the table                                                                                                                                                                                                                                | `string`                      | `"qualifier"`                                                      |
| `maxColor`                | `max-color`                  | Color of cells with the most number of annotations or classes. Any valid CSS color string can be used, such as "rgb(24,73,180)", "#1849b4", or "blue".                                                                                                                   | `string`                      | `"rgb(24,73,180)"`                                                 |
| `maxColorLevel`           | `max-color-level`            | Maximum number of annotations or classes before `maxColor` is applied. If 0, the maximum value is determined from the data.                                                                                                                                              | `number`                      | `0`                                                                |
| `minColor`                | `min-color`                  | Color of cells with the least number of annotations or classes. Any valid CSS color string can be used, such as "rgb(255,255,255)", "#ffffff", or "white".                                                                                                               | `string`                      | `"rgb(255,255,255)"`                                               |
| `orderBy`                 | `order-by`                   | This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering                                                                                            | `string`                      | `"term"`                                                           |
| `ribbonDataApiEndpoint`   | `ribbon-data-api-endpoint`   | URL for the API endpoint to fetch the ribbon data when subjects are provided.                                                                                                                                                                                            | `string`                      | `"https://api.geneontology.org/api/ontology/ribbon/"`              |
| `selected`                | `selected`                   | If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected                                                            | `string`                      | `undefined`                                                        |
| `selectionMode`           | `selection-mode`             | Selection mode for the ribbon cells.                                                                                                                                                                                                                                     | `"cell" \| "column"`          | `"cell"`                                                           |
| `showAllAnnotationsGroup` | `show-all-annotations-group` | If `true`, show the "all annotations" group.                                                                                                                                                                                                                             | `boolean`                     | `true`                                                             |
| `showOtherGroup`          | `show-other-group`           | If `true`, show the "Other" group for each category.                                                                                                                                                                                                                     | `boolean`                     | `true`                                                             |
| `subjectBaseUrl`          | `subject-base-url`           | Base URL used when rendering subject label links.                                                                                                                                                                                                                        | `string`                      | `"https://amigo.geneontology.org/amigo/gene_product/"`             |
| `subjectOpenNewTab`       | `subject-open-new-tab`       | If `true`, clicking a subject label will open the link in a new tab.                                                                                                                                                                                                     | `boolean`                     | `true`                                                             |
| `subjectPosition`         | `subject-position`           | Position subject labels.                                                                                                                                                                                                                                                 | `"left" \| "none" \| "right"` | `"left"`                                                           |
| `subjects`                | `subjects`                   | Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)                                                                                                                                                                                                              | `string`                      | `undefined`                                                        |
| `subset`                  | `subset`                     | Name of the GO subset used for grouping annotations.                                                                                                                                                                                                                     | `string`                      | `"goslim_agr"`                                                     |
| `tableDataApiEndpoint`    | `table-data-api-endpoint`    | URL for the API endpoint to fetch the table data when a group is selected. This is used to fetch the annotations for the selected group and subjects.                                                                                                                    | `string`                      | `"https://api.geneontology.org/api/bioentityset/slimmer/function"` |

## CSS Custom Properties

| Name                              | Description                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--category-separator-width`      | Width of the separator between group categories                                                          |
| `--cell-border-collapse`          | Collapse behavior of cell borders, can be `collapse` or `separate`                                       |
| `--cell-border-color`             | Color of cell borders                                                                                    |
| `--cell-border-style`             | Style of cell borders                                                                                    |
| `--cell-border-width`             | Width of cell borders                                                                                    |
| `--cell-box-shadow`               | Box shadow for cells                                                                                     |
| `--cell-height`                   | Height of each cell                                                                                      |
| `--cell-hovered-border-color`     | Color of the border when a cell is hovered                                                               |
| `--cell-hovered-border-style`     | Style of the border when a cell is hovered                                                               |
| `--cell-hovered-border-width`     | Width of the border when a cell is hovered                                                               |
| `--cell-hovered-box-shadow`       | Box shadow when a cell is hovered                                                                        |
| `--cell-selected-border-color`    | Color of the border when a cell is selected                                                              |
| `--cell-selected-border-style`    | Style of the border when a cell is selected                                                              |
| `--cell-selected-border-width`    | Width of the border when a cell is selected                                                              |
| `--cell-selected-box-shadow`      | Box shadow when a cell is selected                                                                       |
| `--cell-spacing`                  | Spacing between cells (this property has no effect unless `--cell-border-collapse` is set to `separate`) |
| `--cell-width`                    | Width of each cell                                                                                       |
| `--group-all-color`               | Color for the "all" group labels in each category                                                        |
| `--group-all-font-weight`         | Font weight for the "all" group labels in each category                                                  |
| `--group-height`                  | Height of group labels                                                                                   |
| `--group-other-color`             | Color for the "other" group labels in each category                                                      |
| `--group-other-font-weight`       | Font weight for the "other" group labels in each category                                                |
| `--group-selected-color`          | Color for the selected group labels in each category                                                     |
| `--group-text-transform`          | Text transformation for group labels                                                                     |
| `--link-color`                    | Color for links                                                                                          |
| `--link-decoration`               | Text decoration for links                                                                                |
| `--loading-spinner-size`          | Size of the loading spinner displayed when loading ribbon or table data                                  |
| `--subject-color`                 | Color of subject cells                                                                                   |
| `--subject-padding`               | Padding for subject cells                                                                                |
| `--subject-width`                 | Width of subject cells                                                                                   |
| `--table-border`                  | Border style for the table                                                                               |
| `--table-header-background-color` | Background color for the header row                                                                      |
| `--table-header-border-color`     | Border color for header cells                                                                            |
| `--table-header-border-style`     | Border style for header cells                                                                            |
| `--table-header-border-width`     | Border width for header cells                                                                            |
| `--table-header-cell-font-weight` | Font weight for header cells                                                                             |
| `--table-header-cell-padding`     | Padding for header cells                                                                                 |
| `--table-header-color`            | Text color for the header row                                                                            |
| `--table-row-background-color`    | Background color for regular rows                                                                        |
| `--table-row-border-color`        | Border color for regular rows                                                                            |
| `--table-row-border-style`        | Border style for regular rows                                                                            |
| `--table-row-border-width`        | Border width for regular rows                                                                            |
| `--table-row-cell-height`         | Height for regular row cells                                                                             |
| `--table-row-cell-padding`        | Padding for regular row cells                                                                            |
