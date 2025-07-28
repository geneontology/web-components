# go-annotation-ribbon-strips

<!-- Auto Generated Below -->


## Overview

The Annotation Ribbon Strips component displays a grid of cells. Each row in the grid represents
a subject (typically a gene), and each column represents a GO term. The color of each cell
indicates the relative number of GO annotations for that subject to the term or one of its
descendants in the ontology hierarchy. The columns are additionally grouped into categories
which are visually separated in the display.

Events are fired when cells or cell headers (groups) are clicked or hovered over.

## Properties

| Property                  | Attribute                    | Description                                                                                                                                                                                                                        | Type                          | Default                                                |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------ |
| `annotationLabels`        | `annotation-labels`          | Labels used with annotation counts.                                                                                                                                                                                                | `string`                      | `"annotation,annotations"`                             |
| `apiEndpoint`             | `api-endpoint`               | URL for the API endpoint to fetch the ribbon data when subjects are provided.                                                                                                                                                      | `string`                      | `"https://api.geneontology.org/api/ontology/ribbon/"`  |
| `binaryColor`             | `binary-color`               | If `true`, show only two colors (`minColor` and `maxColor`) to indicate the values of a cell. Otherwise, the color of a cell will be interpolated between `minColor` and `maxColor` based on the number of annotations or classes. | `boolean`                     | `false`                                                |
| `classLabels`             | `class-labels`               | Labels used with class counts.                                                                                                                                                                                                     | `string`                      | `"term,terms"`                                         |
| `colorBy`                 | `color-by`                   | Whether to color cells by annotations or classes.                                                                                                                                                                                  | `"annotations" \| "classes"`  | `"annotations"`                                        |
| `groupClickable`          | `group-clickable`            | If `true`, the group labels are clickable and will trigger the `groupClick` event                                                                                                                                                  | `boolean`                     | `true`                                                 |
| `groupMaxLabelSize`       | `group-max-label-size`       | Maximum size of group labels in characters.                                                                                                                                                                                        | `number`                      | `60`                                                   |
| `maxColor`                | `max-color`                  | Color of cells with the most number of annotations or classes.                                                                                                                                                                     | `string`                      | `"24,73,180"`                                          |
| `maxHeatLevel`            | `max-heat-level`             | Maximum number of annotations or classes before `maxColor` is applied.                                                                                                                                                             | `number`                      | `48`                                                   |
| `minColor`                | `min-color`                  | Color of cells with the least number of annotations or classes.                                                                                                                                                                    | `string`                      | `"255,255,255"`                                        |
| `selected`                | `selected`                   | If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected                      | `string`                      | `undefined`                                            |
| `selectionMode`           | `selection-mode`             | Selection mode for the ribbon cells.                                                                                                                                                                                               | `"cell" \| "column"`          | `"cell"`                                               |
| `showAllAnnotationsGroup` | `show-all-annotations-group` | If `true`, show the "all annotations" group.                                                                                                                                                                                       | `boolean`                     | `true`                                                 |
| `showOtherGroup`          | `show-other-group`           | If `true`, show the "Other" group for each category.                                                                                                                                                                               | `boolean`                     | `false`                                                |
| `subjectBaseUrl`          | `subject-base-url`           | Base URL used when rendering subject label links.                                                                                                                                                                                  | `string`                      | `"https://amigo.geneontology.org/amigo/gene_product/"` |
| `subjectOpenNewTab`       | `subject-open-new-tab`       | If `true`, clicking a subject label will open the link in a new tab.                                                                                                                                                               | `boolean`                     | `true`                                                 |
| `subjectPosition`         | `subject-position`           | Position subject labels.                                                                                                                                                                                                           | `"left" \| "none" \| "right"` | `"left"`                                               |
| `subjects`                | `subjects`                   | Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)                                                                                                                                                                        | `string`                      | `undefined`                                            |
| `subset`                  | `subset`                     | Name of the GO subset used for grouping annotations.                                                                                                                                                                               | `string`                      | `"goslim_agr"`                                         |


## Events

| Event        | Description                                  | Type                            |
| ------------ | -------------------------------------------- | ------------------------------- |
| `cellClick`  | Emitted when a ribbon cell is clicked.       | `CustomEvent<RibbonCellEvent>`  |
| `cellEnter`  | Emitted when the mouse enters a ribbon cell. | `CustomEvent<RibbonCellEvent>`  |
| `cellLeave`  | Emitted when the mouse leaves a ribbon cell. | `CustomEvent<RibbonCellEvent>`  |
| `groupClick` | Emitted when a group label is clicked.       | `CustomEvent<RibbonGroupEvent>` |
| `groupEnter` | Emitted when the mouse enters a group label. | `CustomEvent<RibbonGroupEvent>` |
| `groupLeave` | Emitted when the mouse leaves a group label. | `CustomEvent<RibbonGroupEvent>` |


## Methods

### `setData(data: RibbonData | undefined) => Promise<void>`

Sets the data for the ribbon manually.

Once this method is called, the provided data will be used and changes to the subjects,
subset, or apiEndpoint properties will not trigger a data fetch.

#### Parameters

| Name   | Type         | Description |
| ------ | ------------ | ----------- |
| `data` | `RibbonData` |             |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                           | Description                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `--category-separator-width`   | Width of the separator between group categories                                                          |
| `--cell-border-collapse`       | Collapse behavior of cell borders, can be `collapse` or `separate`                                       |
| `--cell-border-color`          | Color of cell borders                                                                                    |
| `--cell-border-style`          | Style of cell borders                                                                                    |
| `--cell-border-width`          | Width of cell borders                                                                                    |
| `--cell-box-shadow`            | Box shadow for cells                                                                                     |
| `--cell-height`                | Height of each cell                                                                                      |
| `--cell-hovered-border-color`  | Color of the border when a cell is hovered                                                               |
| `--cell-hovered-border-style`  | Style of the border when a cell is hovered                                                               |
| `--cell-hovered-border-width`  | Width of the border when a cell is hovered                                                               |
| `--cell-hovered-box-shadow`    | Box shadow when a cell is hovered                                                                        |
| `--cell-selected-border-color` | Color of the border when a cell is selected                                                              |
| `--cell-selected-border-style` | Style of the border when a cell is selected                                                              |
| `--cell-selected-border-width` | Width of the border when a cell is selected                                                              |
| `--cell-selected-box-shadow`   | Box shadow when a cell is selected                                                                       |
| `--cell-spacing`               | Spacing between cells (this property has no effect unless `--cell-border-collapse` is set to `separate`) |
| `--cell-width`                 | Width of each cell                                                                                       |
| `--group-all-color`            | Color for the "all" group labels in each category                                                        |
| `--group-all-font-weight`      | Font weight for the "all" group labels in each category                                                  |
| `--group-height`               | Height of group labels                                                                                   |
| `--group-other-color`          | Color for the "other" group labels in each category                                                      |
| `--group-other-font-weight`    | Font weight for the "other" group labels in each category                                                |
| `--group-text-transform`       | Text transformation for group labels                                                                     |
| `--loading-spinner-size`       | Size of the loading spinner                                                                              |
| `--subject-padding`            | Padding for subject cells                                                                                |
| `--subject-width`              | Width of subject cells                                                                                   |


----------------------------------------------


