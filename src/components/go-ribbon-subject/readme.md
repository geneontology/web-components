# wc-ribbon-subject

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute            | Description | Type                                                                                                                              | Default     |
| ---------------- | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `newTab`         | `new-tab`            |             | `boolean`                                                                                                                         | `undefined` |
| `subject`        | --                   |             | `{ id: string; label: string; taxon_id: string; taxon_label: string; nb_classes: number; nb_annotations: number; groups: [{}]; }` | `undefined` |
| `subjectBaseURL` | `subject-base-u-r-l` |             | `string`                                                                                                                          | `undefined` |

## Events

| Event          | Description                                                                                                                                           | Type               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `subjectClick` | This event is triggered whenever a subject label is clicked Can call preventDefault() to avoid the default behavior (opening the linked subject page) | `CustomEvent<any>` |

## Dependencies

### Used by

- [wc-ribbon-strips](../go-ribbon-strips)

### Graph

```mermaid
graph TD;
  wc-ribbon-strips --> wc-ribbon-subject
  style wc-ribbon-subject fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
