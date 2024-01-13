import ts from "typescript";

const simpleType = [
	"string",
	"number",
	"boolean",
	"bigint",
	"any",
	"unknown",
	"null",
	"unknown",
	"undefined",
	"never",
	"true",
	"false",
];
const httpMethod = ["Get", "Post", "Put", "Delete", "Patch", "Options"];
const httpParams = ["Body", "Query", "Params"];

const program = ts.createProgram(
	["E:/project/drinkjs/ngulf/demo/controller/TestController.ts"],
	{ target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.ES2015 }
);
const checker = program.getTypeChecker();
const sourceFile = program.getSourceFile(
	"E:/project/drinkjs/ngulf/demo/controller/TestController.ts"
);

sourceFile?.forEachChild((node) => {
	if (node.kind === ts.SyntaxKind.ClassDeclaration) {
		parseClassDeclaration(node);
	}
});

function parseClassDeclaration(node: ts.Node) {
	let controller = "";
	node.forEachChild((child) => {
		if (child.kind === ts.SyntaxKind.Decorator) {
			// 解释 @Controller("/test")
			controller = parseController(child);
		} else if (child.kind === ts.SyntaxKind.MethodDeclaration) {
			// 解释 @Get("/get")
			parseMethodDeclaration(child);
		}
	});
	console.log(controller);
}

function parseController(node: any) {
	let controller = "";
	node.forEachChild((child: any) => {
		if (child.kind === ts.SyntaxKind.CallExpression) {
			if (child.expression.escapedText === "Controller") {
				controller = child.arguments[0].text ?? "";
			}
		}
	});
	return controller;
}

function parseMethodDeclaration(node: ts.Node) {
	const router: {
		returnType: string;
		params: { type: string; raw: string, key:string }[];
		method: string;
		path:string
	} = {returnType:"any", params:[], method:"GET", path:"/"};

	// 查类方法参数类型和返回类型
	checker
		.getTypeAtLocation(node)
		.getCallSignatures()
		.forEach((sign) => {
			const returnType = sign.getReturnType();
			const typeObj = parseType(returnType);
			router.returnType = typeObj;

			// 方法里的参数
			// const params = sign.getParameters();
			// params.forEach((param) => {
			// 	const paramType = parseType(checker.getTypeOfSymbol(param));
			// 	paramTypes.set(param.getEscapedName().toString(), paramType);
			// });
		});

	node.forEachChild((child) => {
		if (child.kind === ts.SyntaxKind.Decorator) {
			// 搜索路由方法，如：@Post("/path")
			const methodInfo = parseDecorator(child);
			router.method = methodInfo.raw;
			router.path = methodInfo.path;

		} else if (child.kind === ts.SyntaxKind.Parameter) {
			// 搜索方法参数
			let raw = "";
			let key ="";
			child.forEachChild((paramNode:any) => {
				if (paramNode.kind === ts.SyntaxKind.Decorator) {
					// console.log("==http Params==", parseDecorator(params));
					const data = parseDecorator(paramNode);
					if(data.raw){
						raw = data.raw;
						key = paramNode.expression.arguments[0]?.kind === ts.SyntaxKind.StringLiteral ? paramNode.expression.arguments[0].text : "";
					}
				}else if(raw){
					const type = parseType(checker
						.getTypeAtLocation(paramNode));	
					router.params.push({type, raw, key});	
					raw = "";	
				}
			});
		}
	});

	console.log("路由信息===", router);

	return router;
}

function parseDecorator(node: any) {
	const parseRel = { raw: "", path: "" };
	node.forEachChild((call: any) => {
		if (call.kind === ts.SyntaxKind.CallExpression) {
			// @Post("/path")
			if (httpMethod.includes(call.expression.escapedText)) {
				(parseRel.raw = call.expression.escapedText),
				(parseRel.path = call.arguments[0].text);

			} else if (httpParams.includes(call.expression.escapedText)) {
				// @Body(ZodUser) data: AddZodUser
				// call.getEscapedName()
				parseRel.raw = call.expression.escapedText;
			}
		}
	});
	return parseRel;
}

/**
 * 解释类型
 * @param {*} returnType
 * @returns
 */
function parseType(returnType: any): string {
	let typeRel = "";
	const typeString = checker.typeToString(returnType);
	

	if (checker.isArrayType(returnType)) {
		typeRel = parseType(returnType.resolvedTypeArguments[0]);
		typeRel += "[]";
	} else if (simpleType.includes(typeString)) {
		return typeString;
	} else if (typeString.substring(0, 8) === "Promise<") {
		// Promise 类型
		return checker.typeToString(returnType.resolvedTypeArguments[0]);
	} else if (returnType.types) {
		// 联合类型
		const types: string[] = [];
		returnType.types.forEach((type: any) => {
			types.push(parseType(type));
		});
		return types.join(" | ");
	} else {
		// 对象类型
		const keyTypes: string[] = [];
		checker.getPropertiesOfType(returnType).forEach((type) => {
			let required = ":";
			type.declarations?.forEach((decl: any) => {
				if (decl.questionToken) {
					required = "?:";
				}
			});
			const keyType = parseType(checker.getTypeOfSymbol(type));
			keyTypes.push(`${type.escapedName}${required}${keyType}`);
		});
		typeRel = keyTypes.length ? `{ ${keyTypes.join(", ")} }` : "any";
	}

	return typeRel;
}
