Principia Plot
==============

[![npm](https://img.shields.io/npm/v/principia-plot.svg?style=flat-square)](https://www.npmjs.com/package/principia-plot)
[![Travis](https://img.shields.io/travis/erikbrinkman/principia-plot.svg?style=flat-square)](https://travis-ci.org/erikbrinkman/principia-plot)

A set of classes and a cli for generating plots roughly according to the guiding ideas behind [Principiae](http://www.principiae.be).
This [video](https://youtu.be/6lm4wJ1qm0w) presents a quick discussion on the types of plots that this tool is meant to capture.
The command for generating plots is meant to be minimal, and extended mostly through a public css api, including most translations.
Due to this being entirely without rendering, some features are impossible, i.e. aligning items based off of their size, since their size is inherently unknown.
If you desire more than basic svg generation, use the base [principia](https://github.com/erikbrinkman/principia) tool that includes various rendering options.


Installation and Usage
======================

Install
-------

```
npm i -g principia-plot
```

Usage
-----

```
principia-plot -i <spec.json> -o <result.svg> -c <style.css>
```

will take a plot specification as json and write the compiled svg to the result.
Optional styles can be applied via user supplied styling.
Since this is meant to operate without rendering, some alignment may be necessary via custom css transforms.

JSON API
--------

The spec file is a json file describing the plot.
Many of the items will be common between each plot type, but each josn starts with a a `type` field with a string indicating what chart type ot produce

CSS API
-------

Each plot starts with a root group with several classes, `princ--root`, `princ--<type>`, and optionally a user specified set of classes for global style tweaking.
Different plotting types will default with a theme which will be replaced with user specified classes.

Each plotted set of data will be in a group with the class `princ--item` any user specified classes.
Each plotted item with be successive child elements of their parent container, so the `.princ--item:nth-child` pseudo-selector will pick succesive plotted elements.

In order to make default plotting easier, there are several color themes that take advantage of this to style each item with a new color, however due to css prescience that often means that the selector for an item specific class will get overridden in prescidence by a color theme.
To overcome operator prescidence, styling a specific item should have the following selector `.princ--root .princ--item.<user-class> .princ--<type>`.

The command line api will pull default styles from the built-in style, as well as any css in "\$HOME/.princ_style.css" and ".princ_style.css".
The built in location can be used an example of how to use the css api.


Plot Types
==========

Zero Comparison
---------------

This type of plot is meant to capture comparisons between different labeled numbers, where their absolute magnitude is relevant.
The ultimate representation is a bar style graph, sideways for legibility.

### JSON API

The base json specification for a zero comparison plot is:
```
{
  type: "comparizonz",
  width?: number,
  format?: string,
  classed?: string,
  axis?: {
    format?: string,
    max?: number,
    ticks: number[]
  },
  data: [...]
}
```

- width: How wide the bars should be in pixels.
- format: How to format the number next to each bar.
  Must be a valid d3 format string.
- classed: A space separated list of classes to append to the root element.
  This is commonly used to apply color themes or to tweak the style of the entire plot based on a comprehensive style sheet.
- axis.format: How to format ticks on the axis.
  Must be a valid d3 format string.
- axis.max: The maximum number for the range of bars.
  Set this if you don't want the maximum bar to be full size.
- axis.ticks: An array of ticks to plot on the axis besides the min and max value.

Each element of data is:
```
{
  name: string,
  value: number,
  classed?: string
}
```

- name: The name / label to put next to the bar.
  This can be valid svg xml to allow for extra styling.
- value: The length of the bar / the value to plot.
  This should always be positive.
- classed: A space delimited list of classes to append to this bar.
  Primarily useful for tagging specific data points.

### CSS API

This plot has one xaxis on the bottom following the standard axis api.

Inside each `princ--item` are three groups:

- A label that's by default on left side of the bar with the class `princ--name`.
- A bar in the center of the plot with the label `princ--value`.
- A number representation of the value by default on the right with the class `princ--num`.

The width of each line is controlled by the font size to make things adjustable.
Thus the size and width of the bars and labels are also set via the font size.
To shrink the relative height of the bar, just adjust the font-size in `princ--value` accordingly.

Evolution
---------

This type of plot is meant to capture how one or many variables changes as another evolves.
Its representation is as a line graph.

### JSON API

The base json specification for an evolution plot is:
```
{
  type: "evolution",
  width?: number,
  height?: number,
  classed?: string,
  xaxis?: ...
  yaxis?: ...
  data: [...]
}
```

- width: How wide the plotting area should be in pixels.
- height: How tall the plotting area should be in pixels.
- classed: A space delimited list of classes to apply to the root element.
  This is mainly useful for color schemes and change default styling.

Each axis has the following structure:
```
{
  label?: string,
  format?: string,
  min?: number,
  max?: number,
  ticks?: number[]
}
```

- label: The label to put on the axis.
  This can be valid svg xml to allow for extra styling.
- format: The format for axis ticks.
  Must be a valid d3 format string.
- min: The minimum value to take the axis out to.
  This is useful if you want the axis to go lower than the minimum value in the data.
- max: The maximum value to take the axis out to.
- ticks: Addition values to put tick marks for.
  By default, only the min and max values get ticks.

Each data object can be a line or a span.
Lines are simple line evolutions showing hove the y variable changes with the x variable.
Lines have the following structure:
```
{
  type: "line",
  data: [number, number][],
  classed?: string,
  label?: string,
  curve?: string,
  point?: string
}
```

- data: A list of 2d points to plot.
  The first numbers, x coordinates, should be sorted and unique.
- classed: A space separated list of classes to apply to this specific line.
- label: A string label to place to the right of the line.
  This can be valid svg xml to allow for extra styling.
- curve: The interpolation function to use between points.
  These are all of the d3 available curve functions and must be one of: `linear`, `step`, `step_before`, `step_after`, `basis`, `cardinal`, `monotone`, `catmull_rom`.
- point: The type of point to use to delimit where data exists.
  These are all of the d3 available shapes and must be one of: `circle`, `cross`, `diamond`, `square`, `star`, `triangle`, `wye`.

Spans show how a range of y values changes with x values.
They can also be used to show error around a line.
Spans have the following structure:
```
{
  type: "span",
  data: [number, number, number][],
  classed?: string,
  label?: string,
  curve?: string,
  point?: string
}
```

- data: A list of ranges.
  The first number is the x coordinate, followed by the minimum y coordinate and then the maximum y coordinate.
  Like lines, the x coordinates should be sorted and unique.

### CSS API

This plot has an x and a y axis following the standard axis api.

Each `princ--item` will also have another class indicating whether it's a `princ--line-item` or a `princ--span-item`.
Inside each `princ--item` are three groups:

- `princ--labels` followed by `princ--label` with the label for the item.
- A set of points with label `princ--point`.
- The actual data with wither the class `princ--span` or `princ--line`.

The size of points can be adjusted by scaling up or down the `princ--point` class.
If a line has one of the classes `princ--{dash,dot,dash-dot}` it will get the default styling for those types of line styles.
Labels can be moved away from the data by x translating `princ--labels` or individually separated by translating `princ--label`.

Axes
----

Many plots have axes showing the data, although some tweak presentation slightly.

### CSS API

The axes come in a root group with the class `princ--axis`.
This potentially contains two groups: `princ--xaxis` and `princ--yaxis`.
Each axis is composed of four elements:

- A base line with the class `princ--tick-line`.
- Ticks in a root class `princ--ticks` and then a separate `princ--tick` for each tick.
  Each `princ-tick` will be the `nth-child` in its container and in sorted order, so the selector `princ--tick:nth-child(1)` will get the lowest tick.
- Tick labels in a root class `princ--tick-labels` and the separate `princ--tick-label` for each individual label.
  Like ticks, a `princ--tick-label` will be its `nth-child`.
- An axis label with the class `princ--axis-label`.

The length of axis ticks can be set by x or y scaling the `princ--tick` class.
Translating `princ--tick-labels` and `princ--axis-label` allows adjusting the spacing of those labels.

Colors and Themes
-----------------

In order to make quick styling easier, a number of built in classes exist to change colors.
Color themes set the default coloring for successive items.
Each theme is a class that should be applied to the root element, prefixed by `princ--`.
The available themes are:

- mathematica
- accent
- dark2
- paired
- pastel1
- pastel2
- set1
- set2
- set3
- solarized

In addition there are a number of default colors.
If a color class is applied to an item with the prefix `princ--` it will change the color of that item, if it's applied to the root it will function as a one color theme.
The available colors are:

- umich-blue
- umich-maize
- tappan-red
- wave-field-green
- arboretum-blue
- ross-school-orange
- taubman-teal
- ann-arbor-amethyst
- jeanluc-red
- jeanluc-yellow
- jeanluc-grey


Development
===========

There a number of npm run scripts to aid with development.

- `npm run lint` will lint the typescript.
- `npm run docs` will build the docs for github pages.
- `npm run style` will update the default style sheet from `base_style.css` and `themes.json`.

Future Plot Types
-----------------

- Comparison that's not zero based, essentially points on a line with labels.
- Correlation - scatter plot
- Distribution - show data, box and whisker, violin

To Do
----

- Add example images to plots
- Take better advantage of class inheritance for general setup, like classing and root behavior
- Test colors, themes, line-styles, spans
- Use https://matplotlib.org/gallery/specialty_plots/anscombe.html#sphx-glr-gallery-specialty-plots-anscombe-py for scatter plot example


Acknowledgemnts
===============

- This is all inspired from Jean-Luc Doumont
- Many of the color themes come from [Color Brewer](http://colorbrewer2.org)
- One of the color themes from Mathematica pallet 97.
- Some of the colors come from official [University of Michigan branding](https://vpcomm.umich.edu/brand/style-guide/design-principles/colors).
- One of the color themes from [Solarized](http://ethanschoonover.com/solarized).
