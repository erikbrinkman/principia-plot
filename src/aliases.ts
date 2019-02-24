// A selection of the plot
export type PlotSelect = d3.Selection<SVGGElement, any, any, any>;
// A numeric scale
export type Scale = d3.ScaleContinuousNumeric<number, number>;
// A formatter
export type Format = (domain: number, index?: number) => string;
