# go-gocam-viewer-legend



<!-- Auto Generated Below -->


## Overview

The GO-CAM Viewer Legend component displays a legend for the relations used in the GO-CAM graph
display. This can be used in advanced cases where the `go-gocam-viewer` component is used with
the `show-legend` property set to `false`, and the legend needs to be displayed separately.

## Shadow Parts

| Part         | Description                |
| ------------ | -------------------------- |
| `"header"`   | The header                 |
| `"section"`  | An individual legend entry |
| `"sections"` | Group of legend entries    |


## CSS Custom Properties

| Name                    | Description                    |
| ----------------------- | ------------------------------ |
| `--border-color`        | Border color of the legend     |
| `--border-width`        | Border width of the legend     |
| `--header-background`   | Background of the header       |
| `--header-border-color` | Border color of the header     |
| `--header-border-width` | Border width of the header     |
| `--header-color`        | Text color of the header       |
| `--header-font-weight`  | Text font weight of the header |
| `--header-padding`      | Padding of the header          |
| `--padding`             | Padding of the legend          |


## Dependencies

### Used by

 - [go-gocam-viewer](../gocam-viewer)

### Graph
```mermaid
graph TD;
  go-gocam-viewer --> go-gocam-viewer-legend
  style go-gocam-viewer-legend fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
