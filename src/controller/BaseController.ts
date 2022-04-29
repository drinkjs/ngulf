import { HttpResult } from "../";

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

  tableSuccess<T>(data: T, pagination?: any, msg?: string): HttpResult<T> {
    return {
      code: 0,
      data,
      msg,
      ...pagination,
    };
  }
}
