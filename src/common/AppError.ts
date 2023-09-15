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
