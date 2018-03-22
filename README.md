Principia Plot
==============

[![npm](https://img.shields.io/npm/v/principia-plot.svg?style=flat-square)](https://www.npmjs.com/package/principia-plot)
[![Travis](https://img.shields.io/travis/erikbrinkman/principia-plot.svg?style=flat-square)](https://travis-ci.org/erikbrinkman/principia-plot)

The part of principia for generating svgs.


ToDo
----

- The command line API for creating plots could be a lot better.
  Currently it's just a hacky json interface.
- The api behind class structure should be fixed and documented.
- The classes principia uses should be prefixed, e.g. `princ--`.
- There are more plot styles to adapt from Jean-Luc.
- I think for ux purposes you should be able to style elements both off of their class, but also off of n-th child rules.
- Extending from that, there should be built in theme classes that color nth children and style everything appropriately.
- Similarly, there should be some default color classes like princ-blue, princ-maize, etc (maybe from michigan branding) that can also allow easily color modifications.
- Same, but for standard line styles, e.g. dot, dash-dot, dash, etc.
- It might also be good to make the default style API em based, so one can style a class with a font-size and it changes line thickness and points to match. Similar to the way comparison is written.
