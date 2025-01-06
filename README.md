# ⚠️ EXPERIMENTAL ⚠️

This repository is where we are doing experimental work to consolidate GO web component development into a single repository. This is a work in progress and may undergo significant changes as work progresses.

For the latest stable version of the GO web components, please visit:

- [wc-gocam-viz](https://github.com/geneontology/wc-gocam-viz)
- [wc-ribbon](https://github.com/geneontology/wc-ribbon)

---

[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# GO Web Components

This repository contains a collection of web components produced by the Gene Ontology Consortium focusing on the display of GO Annotation data and GO-CAM models.

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

The second method is to import the individual component or components directly. For example, to use only `wc-go-ribbon` component:

```javascript
import "@geneontology/web-components/wc-go-ribbon";
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

### `wc-go-ribbon`

The `wc-go-ribbon` component displays a ribbon of GO terms associated with one or more gene products.

#### Example

```html
<wc-go-ribbon subjects="RGD:620474,RGD:3889"></wc-go-ribbon>
```

#### Documentation

https://github.com/geneontology/web-components/blob/main/src/components/go-ribbon/readme.md

### `wc-gocam-viz`

The `wc-gocam-viz` component displays a GO-CAM model as a network diagram along with a list of processes and activities in the model.

#### Example

```html
<wc-gocam-viz gocam-id="635b1e3e00001811" show-legend="true"></wc-gocam-viz>
```

#### Documentation

https://github.com/geneontology/web-components/blob/main/src/components/go-gocam-pathway/readme.md

## Development

### Requirements

- [Node.js](https://nodejs.org/) >= 20.0.0

<!-- prettier-ignore-start -->
> [!TIP]
> [nvm](https://github.com/nvm-sh/nvm) can be used to install and manage multiple versions of Node.js.
<!-- prettier-ignore-end -->

### Setup

1. Clone the repository
2. Install project dependencies

   ```bash
   npm install
   ```

3. (Optional) Configure your IDE to automatically format code with [Prettier](https://prettier.io/docs/en/editors). If you do not do this, you can run the formatter manually before pushing changes:

   ```bash
   npm run format
   ```

### Making changes

The development server can be started by running:

```bash
npm start
```

By default, this will start a server on `http://localhost:3333`. From the index page you can navigate to a subpage for the component you are working on. The server will watch for changes to the source files and automatically reload the browser when changes are made.

When updating existing components, it is recommended to add to or update the examples in HTML file(s) alongside the component source code in order to exercise your changes. This will allow you to see the changes in the browser as you work.

To create a new component, create a new directory in `src/components` with the component name. Within that directory, add a `tsx` file which defines the components itself. **Note**: this file should only define **one** component. Also add an `index.html` file which demonstrates the component usage. Add a link to this HTML file in the top-level `index.html` file. If necessary, add a CSS or SCSS file to the component directory.

```text
src/
  components/
    my-component/
      my-component.tsx    # Component source code
      my-component.scss   # Component styles
      index.html          # Component usage example
```

A `readme.md` file will be automatically generated the next time the project is built. This file does not need to be created or edited manually, but it should be committed with your changes.

```bash
npm run build
```

### Testing

To run the test suite, use the following command:

```bash
npm test
```

See the [Stencil documentation](https://stenciljs.com/docs/unit-testing) for more information on writing unit tests for Stencil components.

### Contributing changes

Before opening a pull request, ensure that the following steps have been taken:

- Format code with Prettier (`npm run format`).
- Address any linting errors (`npm run lint`).
- Ensure all tests pass (`npm test`).
- Regenerate any automatically generated files (`npm run build`). **Commit these changes along with your source changes**.
