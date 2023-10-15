/* eslint-disable no-redeclare */
import { z } from "zod";
import { Validation } from "../Validation";
import { createMethodDecorator, createParamDecorator } from "./RouterDecorator";

export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Delete = createMethodDecorator("DELETE");
export const Patch = createMethodDecorator("PATCH");
export const Options = createMethodDecorator("OPTIONS");
export const WSS = createMethodDecorator("WSS");

// export function Query(): ParameterDecorator;
// export function Query(property: string): ParameterDecorator;
// export function Query(validator: Validation): ParameterDecorator;
// export function Query(
//   property: string,
//   validator: Validation
// ): ParameterDecorator;

export function getPropertyAndVaild(
	property?: string | Validation | z.ZodType,
	validator?: Validation | z.ZodType
) {
	const isProperty = property && typeof property === "string";
	const key = isProperty ? property : undefined;
	const valid = isProperty ? validator : property;
	return { key, valid };
}

export function Query(
	property?: string | Validation | z.ZodType,
	validator?: Validation | z.ZodType
) {
	const { key, valid } = getPropertyAndVaild(property, validator);
	return createParamDecorator("query")(key, valid);
}

export function Body(
	property?: string | Validation | z.ZodType,
	validator?: Validation | z.ZodType
) {
	const { key, valid } = getPropertyAndVaild(property, validator);
	return createParamDecorator("body")(key, valid);
}

export function Params(
	property?: string | Validation | z.ZodType,
	validator?: Validation | z.ZodType
) {
	const { key, valid } = getPropertyAndVaild(property, validator);
	return createParamDecorator("params")(key, valid);
}

export function Headers(
	property?: string | Validation | z.ZodType,
	validator?: Validation | z.ZodType
) {
	const { key, valid } = getPropertyAndVaild(property, validator);
	return createParamDecorator("headers")(key, valid);
}

export function UploadedFile() {
	return createParamDecorator("uploadFile")();
}
