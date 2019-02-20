import "jest";
import "assert";
import * as cp from "child_process";
import * as fs from "fs";

describe("Evolution Line Plot", () => {
  const base = fs.readFileSync("test/evolution.ex.bachelor.json", "utf-8");

  it("generates the default svg", () => {
    cp.execFileSync(
      "./bin/cmd.js",
      [
        "-c",
        "test/evolution.ex.bachelor.css",
        "-o",
        "test/evolution.ex.bachelor.svg"
      ],
      {
        input: base,
        encoding: "utf-8"
      }
    );
  });

  it("works with different themes", () => {
    const spec = JSON.parse(base);
    spec.classed = "princ--paired";
    cp.execFileSync(
      "./bin/cmd.js",
      [
        "-c",
        "test/evolution.ex.bachelor.css",
        "-o",
        "test/evolution.ex.bachelor.theme.svg"
      ],
      {
        input: JSON.stringify(spec),
        encoding: "utf-8"
      }
    );
  });

  it("it allows manual color and line style changes", () => {
    const spec = JSON.parse(base);
    spec.data[0].classed = "princ--umich-blue";
    spec.data[1].classed = "princ--ann-arbor-amethyst";
    spec.data[2].classed = "princ--taubman-teal princ--dash";
    spec.data[3].classed = "princ--wave-field-green princ--dot";
    spec.data[4].classed = "princ--umich-maize princ--dash-dot";
    cp.execFileSync(
      "./bin/cmd.js",
      [
        "-c",
        "test/evolution.ex.bachelor.css",
        "-o",
        "test/evolution.ex.bachelor.style.svg"
      ],
      {
        input: JSON.stringify(spec),
        encoding: "utf-8"
      }
    );
  });
});

describe("Evolution Span Plot", () => {
  const base = fs.readFileSync("test/evolution.ex.heart_rate.json", "utf-8");

  it("generates the default svg", () => {
    cp.execSync("./bin/cmd.js -o test/evolution.ex.heart_rate.svg", {
      input: base,
      encoding: "utf-8"
    });
  });

  it("can be themed", () => {
    const spec = JSON.parse(base);
    spec.classed = "princ--solarized";
    cp.execSync("./bin/cmd.js -o test/evolution.ex.heart_rate.theme.svg", {
      input: JSON.stringify(spec),
      encoding: "utf-8"
    });
  });

  it("can be styled", () => {
    const spec = JSON.parse(base);
    spec.data[0].classed = "princ--umich-blue";
    spec.data[1].classed = "princ--umich-blue";
    cp.execSync("./bin/cmd.js -o test/evolution.ex.heart_rate.style.svg", {
      input: JSON.stringify(spec),
      encoding: "utf-8"
    });
  });
});
