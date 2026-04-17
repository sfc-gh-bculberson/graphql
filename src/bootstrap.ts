import { snowflakeConfig } from "./env.js";
import { createSequelize } from "./db/sequelize.js";
import { initCustomer, type Customer } from "./models/customer.js";

export const sequelize = createSequelize({
  account: snowflakeConfig.account,
  username: snowflakeConfig.username,
  password: snowflakeConfig.password,
  database: snowflakeConfig.database,
  schema: snowflakeConfig.schema,
  warehouse: snowflakeConfig.warehouse,
  role: snowflakeConfig.role,
});

initCustomer(sequelize, snowflakeConfig.schema);

export const models = {
  Customer: sequelize.models.Customer as typeof Customer,
};
