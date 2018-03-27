#!/usr/bin/env node
// vim: set syntax=typescript:
import * as d3 from "d3";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as stream from "stream";
import * as yargs from "yargs";
import { Scale } from "./aliases";
import { Evolution, EvolutionItem } from "./evolution";
import { ComparisonZ } from "./comparisonz";
import { JSDOM } from "jsdom";

// TODO At each branch choose between defined type specifications with type
// guards

// Curves
const curves: {[i: string]: d3.CurveFactory} = {
  "linear": d3.curveLinear,
  "step": d3.curveStep,
  "step_before": d3.curveStepBefore,
  "step_after": d3.curveStepAfter,
  "basis": d3.curveBasis,
  "cardinal": d3.curveCardinal,
  "monotone": d3.curveMonotoneX,
  "catmull_rom": d3.curveCatmullRom,
};

// Symbols
const symbols: {[i: string]: d3.SymbolType} = {
  "circle": d3.symbolCircle,
  "cross": d3.symbolCross,
  "diamond": d3.symbolDiamond,
  "square": d3.symbolSquare,
  "star": d3.symbolStar,
  "triangle": d3.symbolTriangle,
  "wye": d3.symbolWye,
};

// Symbols
const scales: {[i: string]: () => Scale} = {
  "linear": d3.scaleLinear,
  "log": d3.scaleLog,
  "sqrt": d3.scaleSqrt,
};

// Dict of plotting evolution types
const evoDatum: {[i: string]: (p: Evolution, d: any) => EvolutionItem } = {
  "line": (plot, data) => plot.line(data),
  "span": (plot, data) => plot.span(data),
};

// Rendering functions
function evo(config: any, svg: SVGSVGElement) {
  config.xaxis = config.xaxis || {};
  config.yaxis = config.yaxis || {};
  config.xaxis.format = d3.format(config.xaxis.format || "");
  config.yaxis.format = d3.format(config.yaxis.format || "");
  config.xaxis.scale = scales[config.xaxis.scale || "linear"]();
  config.yaxis.scale = scales[config.yaxis.scale || "linear"]();
  const plot = new Evolution(config.width || 162, config.height || 100)
    .xaxis(config.xaxis).yaxis(config.yaxis);
  config.xaxis.min === undefined || plot.xmin(config.xaxis.min);
  config.xaxis.max === undefined || plot.xmax(config.xaxis.max);
  config.yaxis.min === undefined || plot.ymin(config.yaxis.min);
  config.yaxis.max === undefined || plot.ymax(config.yaxis.max);
  config.classed === undefined || plot.classed(config.classed);

  config.data.forEach((datum: any) => evoDatum[datum.type](plot, datum.data)
      .label(datum.label || "")
      .classed(datum.classed || "")
      .curve(curves[datum.curve || "catmull_rom"])
      .point(d3.symbol().size(1).type(symbols[datum.point || "circle"])));
  plot.plot(svg);
}

function compz(config: any, svg: SVGSVGElement) {
  config.axis = config.axis || {};
  config.axis.format = d3.format(config.axis.format || "");
  const plot = new ComparisonZ(config.width || 162)
    .numberFormat(d3.format(config.format || ""))
    .axis(config.axis);
  config.axis.max === undefined || plot.max(config.axis.max);
  config.classed === undefined || plot.classed(config.classed);
  config.data.forEach((datum: any) => {
    const { name, value } = datum;
    plot.value(name, value).classed(datum.classed || "");
  });
  plot.plot(svg);
}

const funcs: {[i: string]: (conf: any, svg: SVGSVGElement) => void} = {
  "evolution": evo,
  "comparisonz": compz,
};

const stylePaths = [
  path.join(path.dirname(__dirname), "resources", "princ_style.css"),
  path.join(os.homedir(), ".princ_style.css"),
  ".princ_style.css",
];

const args = yargs
  .usage((process.env.__PRINC_NAME__ || "$0") + "\n\nGenerate a principia svg from a provided json specification. See https://github.com/erikbrinkman/principia-plot#readme for details about how to write a specification.")
  .option("input", {
    "alias": "i",
    "default": "stdin",
    "describe": "Take input json from file.",
  })
  .option("output", {
    "alias": "o",
    "default": "stdout",
    "describe": "Output svg to file.",
  })
  .option("style", {
    "alias": ["css", "c", "s"],
    "array": true,
    "default": [],
    "describe": "Add files as css styling for svg. Any file specified here will be added in addition to any of the following files in order: " + stylePaths.map(p => '"' + p + '"').join(", "),
  })
  .help()
  .alias("version", "V")
  .alias("help", "h")
  .wrap(yargs.terminalWidth())
  .argv;

const config = JSON.parse(fs.readFileSync(args.input === "stdin" ? 0 : args.input, {encoding: "utf-8"}));
const dom = new JSDOM();
const { window } = dom;
const { document } = window;
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
funcs[config.type](config, svg);

const buff = new stream.Readable();
buff.push(svg.outerHTML.slice(0, -6));
buff.push("<style>");
// FIXME minify
stylePaths.forEach((cssFile: string) => {
  try {
    buff.push(fs.readFileSync(cssFile, "utf-8"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
});
args.style.forEach((cssFile: string) => {
  buff.push(fs.readFileSync(cssFile, "utf-8"));
});
buff.push("</style></svg>");
buff.push(null); // tslint:disable-line:no-null-keyword
buff.pipe(args.output === "stdout" ? process.stdout : fs.createWriteStream(args.output));
