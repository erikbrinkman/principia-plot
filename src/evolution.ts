import * as d3 from "d3";
import * as axes from "./axes";
import { BasePlot, BasePlotItem, prefix } from "./base";
import { PlotSelect, Scale, Format } from "./aliases";

export type Point = [number, number];
export type SPoint = [number, number, number];
type Symb = d3.Symbol<unknown, unknown>;

/** The base data type for adding data to an evolution plot. */
export abstract class EvolutionItem extends BasePlotItem {
  protected lab: string;
  protected cve: d3.CurveFactory;
  protected pnt: Symb;

  constructor() {
    super();
    this.lab = "";
    this.cve = d3.curveCatmullRom;
    this.pnt = d3.symbol().size(1).type(d3.symbolCircle);
  }

  /** Get or set the label for the data item */
  label(): string;
  label(lab: string): this;
  label(lab?: string): string | this {
    if (lab === undefined) {
      return this.lab;
    } else {
      // TODO Check certain things about labels, i.e. only whitespace is space
      this.lab = lab;
      return this;
    }
  }

  /** Get or set the curve for the data item */
  curve(): d3.CurveFactory;
  curve(cve: d3.CurveFactory): this;
  curve(cve?: d3.CurveFactory): d3.CurveFactory | this {
    if (cve === undefined) {
      return this.cve;
    } else {
      this.cve = cve;
      return this;
    }
  }

  /** Get or set the point for the data item */
  point(): Symb;
  point(pnt: Symb): this;
  point(pnt?: Symb): Symb | this {
    if (pnt === undefined) {
      return this.pnt;
    } else {
      this.pnt = pnt;
      return this;
    }
  }

  /** Where to plot the label */
  abstract target(): number;

  /** What this items name is */
  abstract name(): string;

  /** Plot the data item */
  plot(group: PlotSelect, x: Scale, y: Scale): PlotSelect {
    const newGroup = this.plotSetup(group).classed(
      prefix + this.name() + "-item",
      true
    );
    newGroup
      .append("g")
      .classed(prefix + "labels", true)
      .append("g")
      .classed(prefix + "label", true)
      .append("text")
      .attr("x", x.range().reverse()[0])
      .attr("y", y(this.target()))
      .html(this.label());
    return newGroup;
  }
}

/** A line */
export class Line extends EvolutionItem {
  private readonly data: Point[];

  constructor(data: Point[]) {
    super();
    this.data = data;
  }

  target(): number {
    return this.data[this.data.length - 1][1];
  }

  name(): string {
    return "line";
  }

  plot(group: PlotSelect, x: Scale, y: Scale): PlotSelect {
    const lineGroup = super.plot(group, x, y);
    // TODO Truncate data if it goes outside of bounds
    const path = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(this.cve)(this.data);
    if (path === null) {
      throw new Error("path was null");
    }
    lineGroup
      .append("g")
      .classed(prefix + this.name(), true)
      .append("path")
      .attr("d", path);
    lineGroup
      .append("g")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g")
      .attr("transform", ([px, py]: Point) => `translate(${x(px)}, ${y(py)})`)
      .append("g")
      .classed(prefix + "point", true)
      .append("path")
      .attr("d", this.pnt);
    return lineGroup;
  }
}

/** A span representing the evolution of a range */
export class Span extends EvolutionItem {
  private readonly data: SPoint[];

  constructor(data: SPoint[]) {
    super();
    this.data = data;
  }

  target(): number {
    const [, low, high] = this.data[this.data.length - 1];
    return (low + high) / 2;
  }

  name(): string {
    return "span";
  }

  plot(group: PlotSelect, x: Scale, y: Scale): PlotSelect {
    const spanGroup = super.plot(group, x, y);
    // TODO Truncate data if it goes outside of bounds?
    const path = d3
      .area<SPoint>()
      .x((d: SPoint) => x(d[0]))
      .y0((d: SPoint) => y(d[1]))
      .y1((d: SPoint) => y(d[2]))
      .curve(this.cve)(this.data);
    if (path === null) {
      throw new Error("path was null");
    }
    spanGroup
      .append("g")
      .classed(prefix + this.name(), true)
      .append("path")
      .attr("d", path);
    const pointData = this.data
      .map(([x, y]) => [x, y] as Point)
      .concat(this.data.map(([x, , y]) => [x, y] as Point));
    spanGroup
      .append("g")
      .selectAll("g")
      .data(pointData)
      .enter()
      .append("g")
      .attr("transform", ([px, py]: Point) => `translate(${x(px)}, ${y(py)})`)
      .append("g")
      .classed(prefix + "point", true)
      .append("path")
      .attr("d", this.pnt);
    return spanGroup;
  }
}

/** Plot an evolution */
export class Evolution extends BasePlot {
  private wdth: number;
  private hght: number;
  private data: EvolutionItem[];
  private xMin: number;
  private xMinSet: boolean;
  private xMax: number;
  private xMaxSet: boolean;
  private yMin: number;
  private yMinSet: boolean;
  private yMax: number;
  private yMaxSet: boolean;
  private xScale: Scale;
  private yScale: Scale;
  private xLabel: string;
  private yLabel: string;
  private xTicks: number[];
  private yTicks: number[];
  private xTickFormat: Format;
  private yTickFormat: Format;

  constructor(width: number, height: number) {
    super(prefix + "mathematica");
    this.wdth = width;
    this.hght = height;
    this.data = [];
    // Bounds
    this.xMin = Infinity;
    this.xMinSet = false;
    this.xMax = -Infinity;
    this.xMaxSet = false;
    this.yMin = Infinity;
    this.yMinSet = false;
    this.yMax = -Infinity;
    this.yMaxSet = false;
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.xLabel = "";
    this.yLabel = "";
    this.xTicks = [];
    this.yTicks = [];
    this.xTickFormat = d3.format("");
    this.yTickFormat = d3.format("");
  }

  /** Add a line to the evolution */
  line(data: Point[]): Line {
    data.forEach(([x, y]) => {
      this.xMinSet || (this.xMin = Math.min(this.xMin, x));
      this.xMaxSet || (this.xMax = Math.max(this.xMax, x));
      this.yMinSet || (this.yMin = Math.min(this.yMin, y));
      this.yMaxSet || (this.yMax = Math.max(this.yMax, y));
    });
    const line = new Line(data);
    this.data.push(line);
    return line;
  }

  /** Add a span to the evolution */
  span(data: SPoint[]): Span {
    data.forEach(([x, y0, y1]) => {
      this.xMinSet || (this.xMin = Math.min(this.xMin, x));
      this.xMaxSet || (this.xMax = Math.max(this.xMax, x));
      this.yMinSet || (this.yMin = Math.min(this.yMin, y0, y1));
      this.yMaxSet || (this.yMax = Math.max(this.yMax, y0, y1));
    });
    const span = new Span(data);
    this.data.push(span);
    return span;
  }

  /** Set the plot width */
  width(width: number): this {
    this.wdth = width;
    return this;
  }

  /** Set the plot height */
  height(height: number): this {
    this.hght = height;
    return this;
  }

  /** Get or set the minimum x value
   *
   * Once set, this value will not be updated by new data.
   */
  xmin(): number;
  xmin(min: number): this;
  xmin(min?: number): number | this {
    if (min === undefined) {
      return this.xMin;
    } else {
      this.xMin = min;
      this.xMinSet = true;
      return this;
    }
  }

  /** Get or set the maximum x value
   *
   * Once set, this value will not be updated by new data.
   */
  xmax(): number;
  xmax(max: number): this;
  xmax(max?: number): number | this {
    if (max === undefined) {
      return this.xMax;
    } else {
      this.xMax = max;
      this.xMaxSet = true;
      return this;
    }
  }

  /** Get or set the x bounds
   *
   * This is a convenience method for xmin and xmax together.
   */
  xbounds(): [number, number];
  xbounds(bounds: [number, number]): this;
  xbounds(bounds?: [number, number]): [number, number] | this {
    if (bounds === undefined) {
      return [this.xmin(), this.xmax()];
    } else {
      const [min, max] = bounds;
      return this.xmin(min).xmax(max);
    }
  }

  /** Get or set the minimum y value
   *
   * Once set, this value will not be updated by new data.
   */
  ymin(): number;
  ymin(min: number): this;
  ymin(min?: number): number | this {
    if (min === undefined) {
      return this.yMin;
    } else {
      this.yMin = min;
      this.yMinSet = true;
      return this;
    }
  }

  /** Get or set the maximum y value
   *
   * Once set, this value will not be updated by new data.
   */
  ymax(): number;
  ymax(max: number): this;
  ymax(max?: number): number | this {
    if (max === undefined) {
      return this.yMax;
    } else {
      this.yMax = max;
      this.yMaxSet = true;
      return this;
    }
  }

  /** Get or set the y bounds
   *
   * This is a convenience method for ymin and ymax together.
   */
  ybounds(): [number, number];
  ybounds(bounds: [number, number]): this;
  ybounds(bounds?: [number, number]): [number, number] | this {
    if (bounds === undefined) {
      return [this.ymin(), this.ymax()];
    } else {
      const [min, max] = bounds;
      return this.ymin(min).ymax(max);
    }
  }

  /** Set properties of the x axis */
  xaxis({
    label = this.xLabel,
    ticks = this.xTicks,
    format = this.xTickFormat,
    scale = this.xScale,
  }: {
    label?: string;
    ticks?: number[];
    format?: Format;
    scale?: Scale;
  }): this {
    this.xLabel = label;
    this.xTicks = ticks;
    this.xTickFormat = format;
    this.xScale = scale;
    return this;
  }

  /** Set properties of the y axis */
  yaxis({
    label = this.yLabel,
    ticks = this.yTicks,
    format = this.yTickFormat,
    scale = this.yScale,
  }: {
    label?: string;
    ticks?: number[];
    format?: Format;
    scale?: Scale;
  }): this {
    this.yLabel = label;
    this.yTicks = ticks;
    this.yTickFormat = format;
    this.yScale = scale;
    return this;
  }

  name(): string {
    return "evolution";
  }

  /** Plot an evolution */
  plot(svgElement: SVGSVGElement): PlotSelect {
    const svg = super.plot(svgElement);
    const x = this.xScale.range([0, this.wdth]).domain(this.xbounds());
    const y = this.yScale.range([this.hght, 0]).domain(this.ybounds());

    // axes
    const axisGroup = svg.append("g").classed(prefix + "axis", true);
    axes.xaxis(
      axisGroup.append("g").attr("transform", `translate(0, ${this.hght})`),
      x,
      this.xbounds().concat(this.xTicks),
      this.xTickFormat,
      this.xLabel
    );
    axes.yaxis(
      axisGroup.append("g"),
      y,
      this.ybounds().concat(this.yTicks),
      this.yTickFormat,
      this.yLabel
    );

    // data
    const dataGroup = svg.append("g");
    this.data.forEach((datum) => datum.plot(dataGroup, x, y));
    return svg;
  }
}
