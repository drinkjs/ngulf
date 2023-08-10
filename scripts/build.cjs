const rimraf = require("rimraf");
const fs = require("fs");
const { execSync } = require("child_process");
// 删除原来的dist目录
rimraf.sync("./dist");
// 执行tsc
execSync("node node_modules/typescript/bin/tsc");
// 复制package.json
const packageJson = fs.readFileSync("package.json");
fs.writeFileSync("./dist/package.json", packageJson);
