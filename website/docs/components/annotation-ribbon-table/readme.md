# go-annotation-ribbon-table

<!-- Auto Generated Below -->


## Overview

The Annotation Ribbon Table component displays a table of GO annotations. This component does not
fetch data by itself, it expects the data to be provided in the `data` attribute.

## Properties

| Property                | Attribute                 | Description                                                                                                                                                                                                                    | Type      | Default                                                            |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------ |
| `apiEndpoint`           | `api-endpoint`            | URL for the API endpoint to fetch the table data when subjects and slims are provided.                                                                                                                                         | `string`  | `"https://api.geneontology.org/api/bioentityset/slimmer/function"` |
| `excludeProteinBinding` | `exclude-protein-binding` | If true, will exclude the protein binding GO term (GO:0005515) from the table                                                                                                                                                  | `boolean` | `true`                                                             |
| `filterBy`              | `filter-by`               | Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx"     | `string`  | `undefined`                                                        |
| `filterReference`       | `filter-reference`        | Comma-separated list of reference prefixes to filter include                                                                                                                                                                   | `string`  | `"PMID:,DOI:,GO_REF:,Reactome:"`                                   |
| `groupBy`               | `group-by`                | Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 | `string`  | `undefined`                                                        |
| `hideColumns`           | `hide-columns`            | Used to hide specific column of the table                                                                                                                                                                                      | `string`  | `undefined`                                                        |
| `orderBy`               | `order-by`                | This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping                                                                                            | `string`  | `undefined`                                                        |
| `slims`                 | `slims`                   | Comma-separate list of GO term IDs (e.g. GO:0003674,GO:0008150,GO:0005575)                                                                                                                                                     | `string`  | `undefined`                                                        |
| `subjects`              | `subjects`                | Comma-separated list of gene IDs (e.g. RGD:620474,RGD:3889)                                                                                                                                                                    | `string`  | `undefined`                                                        |


## Methods

### `setData(data?: TableData) => Promise<void>`

Set the table data manually.

Once this method is called, changes to the subjects or slims properties will not trigger
a refetch of the data.

#### Parameters

| Name   | Type               | Description            |
| ------ | ------------------ | ---------------------- |
| `data` | `TableDataEntry[]` | The table data to set. |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                        | Description                         |
| --------------------------- | ----------------------------------- |
| `--border`                  | Border style for the table          |
| `--header-background-color` | Background color for the header row |
| `--header-border-color`     | Border color for header cells       |
| `--header-border-style`     | Border style for header cells       |
| `--header-border-width`     | Border width for header cells       |
| `--header-cell-font-weight` | Font weight for header cells        |
| `--header-cell-padding`     | Padding for header cells            |
| `--header-color`            | Text color for the header row       |
| `--link-color`              | Color for links                     |
| `--link-decoration`         | Text decoration for links           |
| `--row-background-color`    | Background color for regular rows   |
| `--row-border-color`        | Border color for regular rows       |
| `--row-border-style`        | Border style for regular rows       |
| `--row-border-width`        | Border width for regular rows       |
| `--row-cell-height`         | Height for regular row cells        |
| `--row-cell-padding`        | Padding for regular row cells       |


----------------------------------------------


