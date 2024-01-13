import { z } from "zod";
import { printNode, zodToTs } from "zod-to-ts";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Validation } from "../Validation";
import { CONTROLLER_METADATA, PARAM_METADATA, ROUTE_METADATA } from "./metaKeys";
import { nanoid } from "nanoid";

export interface ParamType {
  key?: string;
  index: number;
  type: Param;
  paramType: any;
  schema?: Record<Param, any>;
  validator?: Validation | z.ZodType | string;
	zodTs?:string
}

export function Controller(path = ""): ClassDecorator {
	return (target: any) => {
		Reflect.defineMetadata(CONTROLLER_METADATA, path, target);
	};
}

export function createMethodDecorator(method: string = "get") {
	return (path: string | symbol = "/"): MethodDecorator => (
		target: object,
		name: string | symbol,
		descriptor: any
	) => {
		Reflect.defineMetadata(
			ROUTE_METADATA,
			{ type: method, path },
			descriptor.value
		);
	};
}

export type Param =
  | "params"
  | "query"
  | "body"
  | "headers"
  | "cookies"
  | "uploadFile";

export function createParamDecorator(type: Param) {
	return (
		key?: any,
		validator?: Validation | z.ZodType | string
	): ParameterDecorator => (
		target: object,
		propertyKey: string | symbol | undefined,
		index: number
	) => {
		if (!propertyKey) return;

		let schema: Record<string, any> | undefined;
		let zodTs: string | undefined;
		if (validator instanceof z.ZodType) {
			schema = zodToJsonSchema(validator);
			const identifier = nanoid();
			const { node } = zodToTs(validator, identifier);
			zodTs = printNode(node);
		}

		const paramsTypes = Reflect.getMetadata(
			"design:paramtypes",
			target,
			propertyKey
		) || [];
		// 这里要注意这里 defineMetadata 挂在 target.name 上
		// 但该函数的参数有顺序之分，下一个装饰器定义参数后覆盖之前的，所以要用 preMetadata 保存起来
		const preMetadata =
      Reflect.getMetadata(PARAM_METADATA, target, propertyKey) || [];

		const newMetadata = [
			{
				key,
				index,
				type,
				validator,
				paramType: paramsTypes[index],
				schema,
				zodTs
			},
			...preMetadata,
		];

		Reflect.defineMetadata(PARAM_METADATA, newMetadata, target, propertyKey);
	};
}
