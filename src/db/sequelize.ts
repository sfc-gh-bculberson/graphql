import { Sequelize } from "sequelize";
import type { SnowflakeConfig } from "./types.js";

export function createSequelize(config: SnowflakeConfig): Sequelize {
  return new Sequelize({
    dialect: "snowflake",
    database: config.database,
    username: config.username,
    password: config.password,
    logging: false,
    dialectOptions: {
      account: config.account,
      warehouse: config.warehouse,
      schema: config.schema,
      ...(config.role ? { role: config.role } : {}),
    },
  });
}
