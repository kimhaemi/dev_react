import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import postcssPrefixer from "postcss-prefixer";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const pakageJson = require("./package.json");
const extensions = [".js", ".jsx", ".ts", ".tsx", ".scss"];
const external = ["react", "react-dom", "styled-components"];

process.env.BABEL_ENV = "production";

export default {
  input: "packageJson.main",
  output: [
    {
      file: pakageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pakageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    babel({
      extensions,
      include: ["packages/src/**/*"],
      exclude: "node_modules/",
      babelHelpers: "runtime",
    }),
    commonjs({
      include: /node_modules/,
    }),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    image(),
    // postcss({
    //   extract: true,
    //   modules: true,
    //   sourceMap: true,
    //   use: ["sass"],
    //   plugins: [
    //     postcssPrefixer({
    //       prefix: `${pakageJson.name}__`,
    //     }),
    //   ],
    // }),
  ],
  external,
};

// function setUpRollup({ input, output }) {
//   return {
//     input,
//     exports: "named",
//     output,
//     watch: {
//       include: "*",
//       exclude: "node_modules/**",
//     },
//     plugins: [
//       peerDepsExternal(),
//       json(),
//       resolve({ extensions }),
//       commonjs({
//         include: /node_modules/,
//       }),
//       typescript({ useTsconfigDeclarationDir: true }),
//       postcss({
//         extract: true,
//         modules: true,
//         sourceMap: true,
//         use: ["sass"],
//         plugins: [
//           postcssPrefixer({
//             prefix: `${pkg.name}__`,
//           }),
//         ],
//       }),
//     ],
//     external: ["react", "react-dom"],
//   };
// }

// export default [
//   setUpRollup({
//     input: "index.ts",
//     output: {
//       file: "dist/cjs.js",
//       sourcemap: true,
//       format: "cjs",
//     },
//   }),
//   setUpRollup({
//     input: "index.ts",
//     output: {
//       file: "dist/esm.js",
//       sourcemap: true,
//       format: "esm",
//     },
//   }),
// ];
