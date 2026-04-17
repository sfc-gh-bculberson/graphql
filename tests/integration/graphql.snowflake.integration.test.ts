import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import type { Application } from "express";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: resolve(projectRoot, ".env") });

const hasSnowflakeCreds =
  Boolean(process.env.SNOWFLAKE_ACCOUNT) &&
  Boolean(process.env.SNOWFLAKE_USERNAME) &&
  Boolean(process.env.SNOWFLAKE_PASSWORD) &&
  Boolean(process.env.SNOWFLAKE_WAREHOUSE);

describe.skipIf(!hasSnowflakeCreds)("GraphQL + Snowflake (snowflake_sample_data / tpcds_sf10tcl)", () => {
  let app: Application;
  let closeApollo: () => Promise<void> = async () => {};

  beforeAll(async () => {
    const { sequelize } = await import("../../src/bootstrap.js");
    await sequelize.authenticate();
    const { createApp } = await import("../../src/app.js");
    const created = await createApp(sequelize);
    app = created.app;
    closeApollo = async () => {
      await created.server.stop();
    };
  });

  afterAll(async () => {
    const { sequelize } = await import("../../src/bootstrap.js");
    await closeApollo?.();
    await sequelize.close();
  });

  it("POST /graphql returns customers backed by Snowflake", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("content-type", "application/json")
      .send({
        query: `query {
          customers(limit: 3) {
            cCustomerSk
            cCustomerId
            cFirstName
            cLastName
          }
        }`,
      })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    const rows = res.body.data?.customers;
    expect(Array.isArray(rows)).toBe(true);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        cCustomerSk: expect.any(String),
      }),
    );
  });

  it("POST /graphql customerHealth touches Snowflake", async () => {
    const res = await request(app)
      .post("/graphql")
      .set("content-type", "application/json")
      .send({ query: `query { customerHealth }` })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data?.customerHealth).toBe("ok");
  });
});
