import { DataTypes, Model, type Sequelize } from "sequelize";

export type CustomerAttrs = {
  cCustomerSk: number;
  cCustomerId: string | null;
  cFirstName: string | null;
  cLastName: string | null;
};

export class Customer extends Model<CustomerAttrs> implements CustomerAttrs {
  declare cCustomerSk: number;
  declare cCustomerId: string | null;
  declare cFirstName: string | null;
  declare cLastName: string | null;
}

export function initCustomer(sequelize: Sequelize, schema: string): typeof Customer {
  Customer.init(
    {
      cCustomerSk: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: "C_CUSTOMER_SK",
      },
      cCustomerId: {
        type: DataTypes.STRING(16),
        allowNull: true,
        field: "C_CUSTOMER_ID",
      },
      cFirstName: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "C_FIRST_NAME",
      },
      cLastName: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: "C_LAST_NAME",
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "CUSTOMER",
      schema,
      timestamps: false,
      underscored: false,
    },
  );
  return Customer;
}
