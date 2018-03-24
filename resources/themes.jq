"/**********",
" * Themes *",
" **********/",
(
  .themes | to_entries | .[] | .key as $key | .value | length as $length | [ [range(1; length + 1)], . ] | transpose | .[] | (
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
  .colors | to_entries | .[] | (
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
  .colors | to_entries | .[] | (
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
