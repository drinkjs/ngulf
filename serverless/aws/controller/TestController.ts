import { Controller, Get, Query } from "../../../dist";

@Controller("/test")
export default class TestController {
	@Get("/get")
	async testGet(@Query("name") name: string) {
		return name;
	}
}
