#!/usr/bin/env node
/* eslint-disable no-undef */

import yargs from "yargs";
import fs from "fs";
import got from "got";
import { pipeline } from "stream/promises";
import unzipper from "unzipper";
import copydir from "copy-dir";
import { exec } from "child_process";

const cwd = process.cwd();

const args = yargs(process.argv.slice(2))
	.option("init", {
		type: "boolean",
		requiresArg: true,
		default: true,
	}).argv;


const { init } = args;

if (init) {
	const zipFile = "https://github.com/drinkjs/ngulf_init/archive/refs/heads/main.zip";

	const readStream = got.stream(zipFile);
	let flag = false;

	console.log("Loading...");
	readStream.on("downloadProgress", (progress) => {
		if (flag && progress.percent !== 1) {
			console.log("\x1b[1ALoading...");
		} else {
			console.log("\x1b[1A" + " ".repeat(10));
		}
		flag = !flag;
	});

	const mainZip = fs.createWriteStream(`${cwd}/main.zip`);
	await pipeline(
		readStream,
		mainZip
	);
	mainZip.close();

	const unzip = fs.createReadStream(`${cwd}/main.zip`).pipe(unzipper.Extract({ path: cwd }));
	unzip.once("close", () => {
		fs.rmSync(`${cwd}/main.zip`);
		copydir.sync(`${cwd}/ngulf_init-main`, `${cwd}/`, {
			utimes: true,
			mode: true,
			cover: true
		});
		fs.rmSync(`${cwd}/ngulf_init-main`, { recursive: true });
		console.log("Installing...");
		exec("npm install");

	});

}

