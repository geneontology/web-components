# @geneontology/web-components

Easily integrate GO data into your website with GO Web Components: a collection of reusable web components produced by the [Gene Ontology Consortium](https://geneontology.org) focusing on the display of GO Annotation data and GO-CAM models.

## Documentation

For full documentation see https://geneontology.github.io/web-components/.

## Installation

These web components are framework-agnostic and designed to be integrated into any web application. The two main ways to install the components are via NPM or by using files served from a CDN.

### NPM

To install the components via NPM, run the following command:

```bash
npm install @geneontology/web-components
```

Once the package is installed, there are two ways to include the components in your application. The first method is to use the top-level lazy loader. Add this code near the beginning of your application code:

```javascript
import "@geneontology/web-components";
```

This will allow you to use all custom elements provided by this package. The necessary code for each component is fetched on demand when it is first used.

The second method is to import the individual component or components directly. For example, to use only `go-annotation-ribbon` component:

```javascript
import "@geneontology/web-components/go-annotation-ribbon";
```

In this case, no dynamic code fetching happens at runtime. This can lead to a more performant final application, but it requires you manage the imports for each component you use.

### CDN

If your application does not use a build system or package manager, you can include the components directly from a CDN. Add the following script tag to your HTML file:

```html
<script
  type="module"
  src="https://unpkg.com/@geneontology/web-components"
></script>
```

## Usage

### `go-annotation-ribbon`

The `go-annotation-ribbon` component displays a ribbon of GO terms associated with one or more gene products.

#### Example

```html
<go-annotation-ribbon subjects="RGD:620474,RGD:3889"></go-annotation-ribbon>
```

### `go-gocam-viewer`

The `go-gocam-viewer` component displays a GO-CAM model as a network diagram along with a list of processes and activities in the model.

#### Example

```html
<go-gocam-viewer
  gocam-id="635b1e3e00001811"
  show-legend="true"
></go-gocam-viewer>
```
