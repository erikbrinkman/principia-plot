import * as d3 from "d3";
import * as axes from "./axes";
import { BasePlot, BasePlotItem, prefix } from "./base";
import { PlotSelect, Scale, Format } from "./aliases";

/** The base comparison data */
export abstract class CompZData extends BasePlotItem {
  /** Plot a comparison item */
  plot(group: PlotSelect, x: Scale, format: Format): PlotSelect {
    void x;
    void format;
    return this.plotSetup(group);
  }
}

/** A value for comparison */
export class ValueZ extends CompZData {
  private lab: string;
  private val: number;

  constructor(label: string, value: number) {
    super();
    this.lab = label;
    this.val = value;
  }

  plot(group: PlotSelect, x: Scale, format: Format): PlotSelect {
    const valueGroup = super.plot(group, x, format);
    // TODO In d3 style this should probably join on this.val, then width will
    // be a function of d, and so will the text
    valueGroup
      .append("g")
      .classed(prefix + "value", true)
      .append("rect")
      .attr("y", "-0.5em")
      .attr("height", "1em")
      .attr("width", x(this.val));
    valueGroup
      .append("g")
      .classed(prefix + "name", true)
      .append("text")
      .html(this.lab);
    valueGroup
      .append("g")
      .attr("transform", `translate(${x.range().reverse()[0]}, 0)`)
      .append("g")
      .classed(prefix + "num", true)
      .append("text")
      .text((_, i) => format(this.val, i));
    return valueGroup;
  }
}

/** A comparison plotter */
export class ComparisonZ extends BasePlot {
  private wdth: number;
  private data: CompZData[];
  private maxVal: number;
  private maxSet: boolean;
  private scale: Scale;
  private format: Format;
  // Axis
  private label: string;
  private ticks: number[];
  private axisFormat: Format;

  constructor(width: number) {
    super(prefix + "jeanluc-red");
    this.wdth = width;
    this.data = [];
    // Bounds
    this.maxVal = 0.0;
    this.maxSet = false;
    this.scale = d3.scaleLinear();
    this.format = d3.format("");
    // Axis
    this.label = "";
    this.ticks = [];
    this.axisFormat = d3.format("");
  }

  /** Add a value to be plotted */
  value(label: string, value: number): ValueZ {
    this.maxSet || (this.maxVal = Math.max(this.maxVal, value));
    const datum = new ValueZ(label, value);
    this.data.push(datum);
    return datum;
  }

  /** Set the width of the plot */
  width(width: number): this {
    this.wdth = width;
    return this;
  }

  /** Set the number format of the plot */
  numberFormat(format: Format): this {
    this.format = format;
    return this;
  }

  /** Get or set the maximum value
   *
   * If set, the value will not be updated with the addition of new data.
   */
  max(): number;
  max(max: number): this;
  max(max?: number): number | this {
    if (max === undefined) {
      return this.maxVal;
    } else {
      this.maxVal = max;
      this.maxSet = true;
      return this;
    }
  }

  /** Set properties of the axis */
  axis({
    label = this.label,
    ticks = this.ticks,
    format = this.axisFormat,
  }: {
    label?: string;
    ticks?: number[];
    format?: Format;
  }): this {
    this.label = label;
    this.ticks = ticks;
    this.axisFormat = format;
    return this;
  }

  name(): string {
    return "comparisonz";
  }

  /** Plot the current state on the svg */
  plot(svgElement: SVGSVGElement): PlotSelect {
    const svg = super.plot(svgElement);
    const x = this.scale.range([0, this.wdth]).domain([0, this.maxVal]);

    // axes
    const axisGroup = svg
      .append("g")
      .classed(prefix + "axis", true)
      .append("g")
      .attr("style", `transform: translateY(${this.data.length - 1}.5em);`);
    axes.xaxis(
      axisGroup,
      x,
      [0, this.maxVal].concat(this.ticks),
      this.axisFormat,
      this.label
    );

    const dataGroup = svg.append("g");
    this.data.forEach((datum, i) =>
      datum
        .plot(dataGroup, x, this.format)
        .attr("style", `transform: translateY(${i}em);`)
    );
    return svg;
  }
}
