# Customization

Many visual aspects of GO Web Components can be customized using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables) (also known as CSS variables) and [CSS shadow parts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts). This allows you to change their visual appearance to better fit your application's design.

:::warning

These features are only available in the GO-CAM Viewer and related components. Support for customizing the GO Annotation Ribbon is still in development.

:::

## CSS Custom Properties

Refer to the CSS Custom Properties section of each component's documentation page to see which CSS custom properties are available for customization. For example, the `go-gocam-viewer` component has a property called `--graph-height` which controls the height of the overall display. If your want to change the height to suit your application better, you can add the following to your application's CSS:

```css
go-gocam-viewer {
  --graph-height: 400px;
}
```

As many variables as you like can be set in this way, allowing you to customize the component's appearance to fit your application's design.

```css
go-gocam-viewer {
  --graph-height: 400px;
  --border-color: orange;
  --button-background: #6a4b0d;
  --button-color: rgb(255, 255, 255);
  --panel-header-padding: 5px 10px;
}
```

## CSS Shadow Parts

Some components expose shadow parts that can be styled directly. This allows you to target specific parts of the component's [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) for styling. Refer to the Shadow Parts section of each component's documentation page to see which parts are available. Then use the `::part()` [pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to style them. For example, the `go-gocam-viewer` component has a shadow part called `gocam-title` which can be styled like this:

```css
go-gocam-viewer::part(gocam-title) {
  color: darkblue;
  font-weight: bold;
}
```
