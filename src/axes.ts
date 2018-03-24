import { PlotSelect, Scale, Format } from "./aliases";

/** Generate an x axis */
export function xaxis(group: PlotSelect, x: Scale, ticks: number[], format: Format, label: string) {
  const xgroup = group.append("g").classed("princ--xaxis", true);
  const sticks = [...new Set(ticks)].sort();
  xgroup.append("line").classed("princ--tick-line", true)
    .attr("x1", x.range()[0])
    .attr("x2", x.range().reverse()[0]);
  xgroup.append("g").classed("princ--ticks", true)
    .selectAll("g").data(sticks).enter().append("g")
    .classed("princ--tick", true)
    .append("g").attr("transform", t => `translate(${x(t)}, 0)`)
    .append("line")
    .attr("y2", -1);
  xgroup.append("g").classed("princ--tick-labels", true)
    .selectAll("g").data(sticks).enter().append("g")
    .classed("princ--tick-label", true)
    .append("g").attr("transform", t => `translate(${x(t)}, 0)`)
    .append("text")
    .text(t => format(t));
  xgroup
    .append("g").attr("transform", `translate(${x.range().reduce((a, b) => a + b) / 2}, 0)`)
    .append("g").classed("princ--axis-label", true)
    .append("text")
    .text(label);
}

/** Generate a y axis */
export function yaxis(group: PlotSelect, y: Scale, ticks: number[], format: Format, label: string) {
  const ygroup = group.append("g").classed("princ--yaxis", true);
  const sticks = ticks.slice().sort();
  ygroup.append("line").classed("princ--tick-line", true)
    .attr("y1", y.range()[0])
    .attr("y2", y.range().reverse()[0]);
  ygroup.append("g").classed("princ--ticks", true)
    .selectAll("g").data(sticks).enter().append("g")
    .classed("princ--tick", true)
    .append("g").attr("transform", t => `translate(0, ${y(t)})`)
    .append("line")
    .attr("x2", 1);
  ygroup.append("g").classed("princ--tick-labels", true)
    .selectAll("g").data(sticks).enter().append("g")
    .classed("princ--tick-label", true)
    .append("g").attr("transform", t => `translate(0, ${y(t)})`)
    .append("text")
    .text(t => format(t));
  ygroup
    .append("g").attr("transform", `translate(0, ${y.range().reverse()[0]})`)
    .append("g").classed("princ--axis-label", true)
    .append("text")
    .text(label);
}
