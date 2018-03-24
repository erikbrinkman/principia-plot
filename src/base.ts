import * as d3 from "d3";
import { PlotSelect } from "./aliases";

export const prefix = "princ--";

export abstract class BasePlotItem {
  protected cls: string;

  constructor() {
    this.cls = "";
  }

  /** Get or set the classes for the data item */
  classed(): string;
  classed(cls: string): this;
  classed(cls?: string): string | this {
    if (cls === undefined) {
      return this.cls;
    } else {
      this.cls = cls;
      return this;
    }
  }

  /** Plot the data item */
  protected plotSetup(group: PlotSelect): PlotSelect {
    return group.append("g")
      .classed(prefix + "item", true)
      .classed(this.cls, true);
  }
}

/** Base class for plotting */
export abstract class BasePlot {
  private cls: string;

  constructor(cls: string) {
    this.cls = cls;
  }

  /** Get or set classes for the whole plot */
  classed(): string;
  classed(cls: string): this;
  classed(cls?: string): string | this {
    if (cls === undefined) {
      return this.cls;
    } else {
      this.cls = cls;
      return this;
    }
  }

  protected abstract name(): string;

  /** Plot an evolution */
  plot(svgElement: SVGSVGElement): PlotSelect {
    return d3.select(svgElement).append("g")
      .classed(prefix + "root", true)
      .classed(prefix + this.name(), true)
      .classed(this.cls, true);
  }
}
