import * as d3 from "d3";
import * as axes from "./axes";
import { ComparisonZ } from "./comparisonz";
import { Evolution } from "./evolution";
import { PlotSelect, Scale, Format } from "./aliases";

/** Plot an x axis */
export function xaxis(group: PlotSelect, x: Scale, ticks: number[] = x.domain(), format: Format = d3.format(""), label: string = "") {
  return axes.xaxis(group, x, ticks, format, label);
}

/** Plot a y axis */
export function yaxis(group: PlotSelect, y: Scale, ticks: number[] = y.domain(), format: Format = d3.format(""), label: string = "") {
  return axes.yaxis(group, y, ticks, format, label);
}

/** Create a comparison z plot */
export function comparisonz(width: number = 162): ComparisonZ {
  return new ComparisonZ(width);
}

/** Create an evolution plot */
export function evolution(width: number = 162, height: number = 100): Evolution {
  return new Evolution(width, height);
}
