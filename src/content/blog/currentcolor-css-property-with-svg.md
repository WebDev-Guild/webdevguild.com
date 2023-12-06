---
title: Using the currentColor CSS Property with SVG
publishDate: Mon Sep 26 2022 00:00:00 GMT-0400 (Eastern Daylight Time)
excerpt: The CSS currentColor property is a powerful tool for passing colors down the cascade, including to SVG elements.
featureImage:
  src: '/assets/blog/currentcolor-css-property-with-svg.jpg'
  alt: 'Paint on a canvas'
---

<small>This post was originally written for the [Echobind blog](https://echobind.com/blog).</small>

The `currentColor` property provides the current text color of the selected element. The CSS cascade makes it so the child’s text color matches the parents, but the `currentColor` property can be used for any other color property as well, like background or border colors.

```css
.parent {
  color: red;
}

.child {
  border-color: currentColor; /* Also red */
}
```

This also includes properties on [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) elements on the page. Using `currentColor` as the `fill` or `stroke` color on a shape or path will have that element take on the text color of its parent. It even works with a CSS animation.

<iframe height="300" style="width: 100%;" scrolling="no" title="CurrentColor SVG" src="https://codepen.io/alexanderson1993/embed/qBojRqV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/alexanderson1993/pen/qBojRqV">
  CurrentColor SVG</a> by Alex (<a href="https://codepen.io/alexanderson1993">@alexanderson1993</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

It’s important to remember that this only works if the SVG is rendered directly on the page - it won’t work if the SVG is loaded with an `<img>` tag.
