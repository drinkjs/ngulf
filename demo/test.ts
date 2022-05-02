// import * as ts from "typescript";
// import * as fs from "fs"
// import * as vm from "vm"
// import {IocFactory} from "../dist"

// // const file = fs.readFileSync(__dirname + "/demo/controller/HomeController.ts").toString("utf-8");

// const source = `import HomeController from "./controller/HomeController"; export default [HomeController]`;

// const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

// const context = {
//   exports: {},
//   require: require,
// };
// const vmcontext = vm.createContext(context);

// const script = new vm.Script(result.outputText);

// const Obj = script.runInContext(vmcontext)

// console.log(IocFactory(Obj[0]));
