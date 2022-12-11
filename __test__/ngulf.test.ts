import fetch from "node-fetch";
import { describe, beforeAll, expect, test, afterAll } from "@jest/globals";
import Ngulf from "../src";
import IndexController from "./controller/IndexController";

let app: Ngulf;

describe("ngulf test", () => {
  beforeAll(() => {
    app = Ngulf.create({
      routePrefix: "/api",
      controllers: [IndexController],
      orm: {
        type: "mysql",
        port: 3306,
        host: "localhost",
        username: "root",
        password: "2012131417",
        database: "test",
        entityPrefix: "ng_",
        entities: [`${__dirname}/entity/*{.ts,.js}`],
        bigNumberStrings: false,
        synchronize: true, // 生产环境必需为false，否则可能会丢失数据
      },
    });
    return app.listen({ port: 8787 });
  });

  test("api", async () => {
    const addRes = await fetch("http://localhost:8787/api/index/add", {
      method: "post",
      body: JSON.stringify({ name: "ngulf" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(addRes.status).toBe(200);

    const getRes = await fetch(
      "http://localhost:8787/api/index/get?name=ngulf"
    );
    expect(getRes.status).toBe(200);
    const data = await getRes.json();
    expect(data.name).toBe("ngulf");
  });

  afterAll((done) => {
    done();
  });
});
