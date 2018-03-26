import {} from "jest";
import * as assert from "assert";
import * as cp from "child_process";
import * as fs from "fs";

describe("Comparison Zero Plot", () => {
  const base = fs.readFileSync("test/comparisonz.ex.bachelor.json")

  it("generates the default svg", () => {
    cp.execFileSync("./bin/cmd.js", ["-c", "test/comparisonz.ex.bachelor.css", "-o", "test/comparisonz.ex.bachelor.svg"], {
      input: base,
      encoding: "utf-8",
    });
  });

  it("works with different themes", () => {
    const spec = JSON.parse(base)
    spec.classed = "princ--solarized";
    cp.execFileSync("./bin/cmd.js", ["-c", "test/comparisonz.ex.bachelor.css", "-o", "test/comparisonz.ex.bachelor.theme.svg"], {
      input: JSON.stringify(spec),
      encoding: "utf-8",
    });
  });

  it("it allows manual color and line style changes", () => {
    const spec = JSON.parse(base);
    spec.data[0].classed = "princ--umich-blue";
    spec.data[1].classed = "princ--ann-arbor-amethyst";
    spec.data[2].classed = "princ--taubman-teal";
    spec.data[3].classed = "princ--wave-field-green";
    spec.data[4].classed = "princ--umich-maize";
    cp.execFileSync("./bin/cmd.js", ["-c", "test/comparisonz.ex.bachelor.css", "-o", "test/comparisonz.ex.bachelor.style.svg"], {
      input: JSON.stringify(spec),
      encoding: "utf-8",
    });
  });
});
