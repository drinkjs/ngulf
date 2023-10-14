import { z } from "zod";

export class AppError extends Error {
	static assert(msg: string) {
		throw new AppError(msg);
	}
}

export class ValidationError extends Error {
	static assert(msg: string) {
		throw new ValidationError(msg);
	}
}

export class ZodError extends Error {
	error:z.ZodError<any>;
	constructor(error:z.ZodError<any>){
		super("");
		this.error = error;
	}
	static assert(error:z.ZodError<any>) {
		throw new ZodError(error);
	}
}
