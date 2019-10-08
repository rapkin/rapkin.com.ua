import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "assets/js/bundle.js",
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: "node_modules/**"
    }),
    terser()
  ]
};
