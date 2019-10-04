import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "assets/js/bundle.js",
    format: "iife"
  },
  plugins: [resolve(), commonjs()]
};
