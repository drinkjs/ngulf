import { HttpResult } from "../types";

type ListData<T> = {
  list: T;
  pagination: { current: number; pageSize: number; total: number };
};

export abstract class BaseController {
	fail<T>(msg: string, code = 1): HttpResult<T> {
		return {
			code,
			msg,
		};
	}

	success<T>(data: T, msg?: string): HttpResult<T> {
		return {
			code: 0,
			data,
			msg,
		};
	}

	listSuccess<T>(
		data: T,
		pagination: { current: number; pageSize: number; total: number },
		msg?: string
	): HttpResult<ListData<T>> {
		return {
			code: 0,
			msg,
			data: {
				list: data,
				pagination,
			},
		};
	}
}
