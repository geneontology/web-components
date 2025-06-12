# Installation

These web components are framework-agnostic and designed to be integrated into any web application. The two main ways to install the components are via NPM or by using files served from a CDN.

## NPM

To install the components via NPM, run the following command:

```bash
npm install @geneontology/web-components
```

Once the package is installed, there are three ways to include the components in your application. Choose on the one that makes the most sense for your application.

The first method is to use the top-level lazy loader. This will allow you to use all custom elements provided by this package. The necessary code for each component is fetched on demand when it is first used. To use this method, add this code near the beginning of your application code:

```javascript
import "@geneontology/web-components";
```

The second method is to import the individual component or components directly. In this case, no dynamic code fetching happens at runtime. This can lead to a more performant final application, but it requires you manage the imports for each component you use. For example, to use only `wc-go-ribbon` component:

```javascript
import "@geneontology/web-components/wc-go-ribbon";
```

The third method is to manually call the `defineCustomElements` function. This method is useful in rare scenarios where you need to control when the components are defined. To use this method, add this code near the beginning of your application code:

```javascript
import { defineCustomElements } from "@geneontology/web-components/loader";

// Place this call where it is appropriate in your application
defineCustomElements();
```

## CDN

If your application does not use a build system or package manager, you can include the components directly from a CDN. Add the following script tag to your HTML file:

```html
<script
  type="module"
  src="https://unpkg.com/@geneontology/web-components@1"
></script>
```
