import fetch from "node-fetch";
import { describe, beforeAll, expect, test, afterAll } from "@jest/globals";
import { launch } from "../demo/launch";

describe("ngulf test", () => {
  beforeAll(() => {
    const app = launch();
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
