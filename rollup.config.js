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
				format: "es",
				file: "dist/index.js",
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
	{
		input: "./bin.mjs",
		output: [
			{
				format: "es",
				file: "dist/bin/index.mjs",
				banner:"#!/usr/bin/env node",
			},
		],
	},
	{
		input: "./src/class-validator.ts",
		output: [
			{
				format: "es",
				file: "dist/class-validator.js",
				banner,
			},
		],
	},
	{
		input: "./src/fastify.ts",
		output: [
			{
				format: "es",
				file: "dist/fastify.js",
				banner,
			},
		],
	},
	{
		input: "./src/websocket.ts",
		output: [
			{
				format: "es",
				file: "dist/websocket.js",
				banner,
			},
		],
	},
	{
		input: "./src/zod.ts",
		output: [
			{
				format: "es",
				file: "dist/zod.js",
				banner,
			},
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
