import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
// import dts from "rollup-plugin-dts";

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
				file: "dist/index.cjs",
				banner,
			},
			{
				format: "es",
				file: "dist/index.mjs",
				banner,
			},
		],
		plugins: [
			del({ targets: "dist/*" }), 
			typescript(),
			copy({
				targets: [
					{ src: "./package.json", dest: "dist/" },
					{ src: "./README.md", dest: "dist/" },
					{ src: "./LICENSE", dest: "dist/" },
				]
			})
		],
	},
	// {
	// 	input: "./src/index.ts",
	// 	output: { format: "es", file: "dist/index.d.ts" },
	// 	plugins: [
	// 		dts.default(),
	// 		{
	// 			name: "types",
	// 			banner: "/// <reference types=\"./fastify\" />",
	// 		},
	// 	],
	// },
];
