"/**********",
" * Themes *",
" **********/",
(
  {
    mathematica: [
      "#5e81b5",
      "#e19c24",
      "#8fb032",
      "#eb6235",
      "#8778b3",
      "#c56e1a",
      "#5d9ec7",
      "#ffbf00",
      "#a5609d",
      "#929600",
      "#e95536",
      "#6685d9",
      "#f89f13",
      "#bc5b80",
      "#47b66d"
    ],
    accent: [
      "#7fc97f",
      "#beaed4",
      "#fdc086",
      "#ffff99",
      "#386cb0",
      "#f0027f",
      "#bf5b17",
      "#666666"
    ],
    dark2: [
      "#1b9e77",
      "#d95f02",
      "#7570b3",
      "#e7298a",
      "#66a61e",
      "#e6ab02",
      "#a6761d",
      "#666666"
    ],
    paired: [
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928"
    ],
    pastel1: [
      "#fbb4ae",
      "#b3cde3",
      "#ccebc5",
      "#decbe4",
      "#fed9a6",
      "#ffffcc",
      "#e5d8bd",
      "#fddaec",
      "#f2f2f2"
    ],
    pastel2: [
      "#b3e2cd",
      "#fdcdac",
      "#cbd5e8",
      "#f4cae4",
      "#e6f5c9",
      "#fff2ae",
      "#f1e2cc",
      "#cccccc"
    ],
    set1: [
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
      "#999999"
    ],
    set2: [
      "#66c2a5",
      "#fc8d62",
      "#8da0cb",
      "#e78ac3",
      "#a6d854",
      "#ffd92f",
      "#e5c494",
      "#b3b3b3"
    ],
    set3: [
      "#8dd3c7",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
      "#d9d9d9",
      "#bc80bd",
      "#ccebc5",
      "#ffed6f"
    ],
    solarized: [
      "#6c71c4",
      "#d33682",
      "#dc322f",
      "#cb4b16",
      "#859900",
      "#2aa198",
      "#268bd2",
      "#b58900"
    ]
  } | to_entries | .[] | .key as $key | .value | length as $length | [ [range(1; length + 1)], . ] | transpose | .[] | (
    ".princ--\($key) .princ--item:nth-child(\($length)n+\(.[0])) .princ--line {",
    "    stroke: \(.[1]);",
    "}",
    ".princ--\($key) .princ--item:nth-child(\($length)n+\(.[0])) .princ--point,",
    ".princ--\($key) .princ--item:nth-child(\($length)n+\(.[0])) .princ--span,",
    ".princ--\($key) .princ--item:nth-child(\($length)n+\(.[0])) .princ--value,",
    ".princ--\($key) .princ--item:nth-child(\($length)n+\(.[0])) .princ--label {",
    "    fill: \(.[1]);",
    "}",
    ""
  )
),
"",
"/**********",
" * Colors *",
" **********/",
(
  {
    "umich-blue": "#00274c",
    "umich-maize": "#ffcb05",
    "tappan-red": "#B1261D",
    "wave-field-green": "#B7B210",
    "arboretum-blue": "#196CB5",
    "ross-school-orange": "#E97E23",
    "taubman-teal": "#0FAFAF",
    "ann-arbor-amethyst": "#6E2E8D",
    "jeanluc-red": "#EE7773",
    "jeanluc-yellow": "#F5BF70",
    "jeanluc-grey": "#828282",
    "jeanluc-gray": "#828282"
  } | (
    (
      to_entries | .[] | (
        ".princ--\(.key) .princ--item .princ--line {",
        "    stroke: \(.value);",
        "}",
        ".princ--\(.key) .princ--item .princ--point,",
        ".princ--\(.key) .princ--item .princ--span,",
        ".princ--\(.key) .princ--item .princ--value,",
        ".princ--\(.key) .princ--item .princ--label {",
        "    fill: \(.value);",
        "}",
        ""
      )
    ),
    (
      to_entries | .[] | (
        ".princ--root .princ--item.princ--\(.key) .princ--line {",
        "    stroke: \(.value);",
        "}",
        ".princ--root .princ--item.princ--\(.key) .princ--point,",
        ".princ--root .princ--item.princ--\(.key) .princ--span,",
        ".princ--root .princ--item.princ--\(.key) .princ--value,",
        ".princ--root .princ--item.princ--\(.key) .princ--label {",
        "    fill: \(.value);",
        "}",
        ""
      )
    )
  )
)
