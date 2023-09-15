import axios from "axios";
import { describe, expect, test } from "vitest";

const req = axios.create({
  baseURL: "http://localhost:8787/api",
  timeout: 1000,
});

describe("ngulf test", () => {
  test("get", async () => {
    const name = "get";
    const response = await req.get(`/test/get?name=${name}`);
    expect(response.data).toBe(name);
  });

  test("post", async () => {
    const name = "post";
    const response = await req.post("/test/post", { name });
    expect(response.data).toEqual({ name });
  });

  test("put", async () => {
    const name = "put";
    const response = await req.put("/test/put", { name });
    expect(response.data).toEqual({ name });
  });

  test("delete", async () => {
    const name = "delete";
    const response = await req.delete("/test/delete", { params: { name } });
    expect(response.data).toEqual({ name });
  });

  test("headers", async () => {
    const name = "headers";
    const response = await req.get("/test/headers", {
      headers: { "x-name": name },
    });
    expect(response.data).toEqual(name);
  });

  test("post and headers", async () => {
    const firstName = "post";
    const lastName = "headers";
    const response = await req.post(
      "/test/post/headers",
      { name: firstName },
      { headers: { "x-name": lastName } }
    );
    expect(response.data).toEqual({ firstName, lastName });
  });

  test("validator", async () => {
    const response = await req.post("/test/validator", { name: "" });
    expect(response.data).toEqual({ code: 500, msg: "name不能为空" });
  });

  test("orm", async () => {
    const name = Date.now().toString(36);
    const response = await req.post("/test/orm", { name, age: 23 });
    expect(response.data.name).toEqual(name);
    expect(response.data.age).toEqual(23);
  });

  test("mongo", async () => {
    const name = Date.now().toString(36);
    const type = "javascript";
    const response = await req.post("/test/mongo", { name, type });
    expect(response.data.name).toEqual(name);
    expect(response.data.type).toEqual(type);
  });

  test("redis", async () => {
    const name = Date.now().toString(36);
    const type = "javascript";
    await req.post("/test/mongo", { name, type });
    const response = await req.get(`/test/redis?name=${name}`)
    expect(response.data.name).toEqual(name);
    expect(response.data.type).toEqual(type);
  });

});
