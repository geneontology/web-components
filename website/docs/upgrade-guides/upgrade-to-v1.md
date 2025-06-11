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
