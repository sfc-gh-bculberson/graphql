import type { Sequelize } from "sequelize";
import type { Customer } from "./models/customer.js";

export type GraphqlContext = {
  sequelize: Sequelize;
  models: { Customer: typeof Customer };
};

export function createContext(sequelize: Sequelize, CustomerModel: typeof Customer): GraphqlContext {
  return { sequelize, models: { Customer: CustomerModel } };
}
