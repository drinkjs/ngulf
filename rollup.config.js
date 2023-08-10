import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
// import copy from 'rollup-plugin-copy'
// import dts from "rollup-plugin-dts";
// import fs from "fs"

const banner = `/*!
  * ${pkg.name} ${pkg.version}
  * MIT license
*/
`;

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        format: "cjs",
        file: "dist/index.cjs.js",
        banner,
      },
      {
        format: "es",
        file: "dist/index.esm.js",
        banner,
      },
    ],
    plugins: [del({ targets: "dist/*" }), typescript()],
  },
  // {
  //   input: "./src/index.ts",
  //   output: { format: "es", file: "dist/types/index.d.ts" },
  //   plugins: [
  //     dts.default(),
  //     {
  //       name: "clients",
  //       banner: fs.readdirSync(`${__dirname}/src/types`)
  //         .map(s => s.replace(/\.ts$/, "").replace(/\.d$/, ""))
  //         .map(s => `/// <reference types="./${s}" />`)
  //         .join("\n"),
  //     },
  //   ],
  // },
];
