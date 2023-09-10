import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";

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
				file: "dist/index.js",
				banner,
			},
			{
				format: "es",
				file: "dist/index.mjs",
				banner,
			},
		],
		plugins: [del({ targets: "dist/*" }), typescript(), copy({
			targets: [
				{ src: "src/types.d.ts", dest: "dist/" },
			]
		})],
	},
	{
		input: "./src/index.ts",
		output: { format: "es", file: "dist/index.d.ts" },
		plugins: [
			dts.default(),
			{
				name: "types",
				banner: "/// <reference types=\"./types\" />",
			},
		],
	},
];
