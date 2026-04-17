import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

export const snowflakeConfig = {
  account: required("SNOWFLAKE_ACCOUNT"),
  username: required("SNOWFLAKE_USERNAME"),
  password: required("SNOWFLAKE_PASSWORD"),
  database: process.env.SNOWFLAKE_DATABASE ?? "snowflake_sample_data",
  schema: process.env.SNOWFLAKE_SCHEMA ?? "TPCDS_SF10TCL",
  warehouse: required("SNOWFLAKE_WAREHOUSE"),
  role: process.env.SNOWFLAKE_ROLE,
};

export const port = Number(process.env.PORT ?? "4000");
