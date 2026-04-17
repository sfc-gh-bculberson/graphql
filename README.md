# graphql-snowflake-tpcds

GraphQL API backed by [Snowflake](https://www.snowflake.com/) sample TPC-DS data. The server uses [Apollo Server](https://www.apollographql.com/docs/apollo-server/) on Express and [Sequelize v6](https://sequelize.org/) with the [experimental Snowflake dialect](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#snowflake-experimental) (`snowflake-sdk`) to read from `snowflake_sample_data` / `TPCDS_SF10TCL` (configurable).

For the shortest path from zero to a running server, see **[QUICKSTART.md](./QUICKSTART.md)**.

## Prerequisites

- **Node.js** 18 or newer
- A Snowflake account with access to the shared **`snowflake_sample_data`** database (and a warehouse that can run queries against it)

## Quick start (summary)

1. `npm install`
2. Copy `.env.example` to `.env` and set Snowflake credentials
3. `npm run dev`
4. Send a `POST` request to `http://localhost:4000/graphql` with a JSON body (see [example](#example-graphql-request) or [QUICKSTART.md](./QUICKSTART.md))

Full step-by-step copy-paste flow: [QUICKSTART.md](./QUICKSTART.md).

## Configuration

Environment variables are loaded from `.env` at runtime. See [.env.example](./.env.example) for names and sample values.

| Variable | Required | Description |
|----------|----------|-------------|
| `SNOWFLAKE_ACCOUNT` | Yes | Account identifier (e.g. `xy12345.us-east-1`) |
| `SNOWFLAKE_USERNAME` | Yes | Snowflake user |
| `SNOWFLAKE_PASSWORD` | Yes | Password |
| `SNOWFLAKE_WAREHOUSE` | Yes | Warehouse used for queries |
| `SNOWFLAKE_DATABASE` | No | Default `snowflake_sample_data` |
| `SNOWFLAKE_SCHEMA` | No | Default `TPCDS_SF10TCL` |
| `SNOWFLAKE_ROLE` | No | Optional role |
| `PORT` | No | HTTP port, default `4000` |

Never commit `.env`; it is listed in `.gitignore`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run the API with `tsx` and file watch |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/index.js` |
| `npm run test:integration` | Run Vitest integration tests against Snowflake (skipped if env is incomplete) |

## HTTP endpoints

- **`GET /health`** — Liveness JSON (`{ "status": "ok" }`). Does not hit Snowflake.
- **`POST /graphql`** — GraphQL; context uses Sequelize/Snowflake for resolvers that need the database.

### Example GraphQL request

```bash
curl -sS http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"query { customers(limit: 2) { cCustomerSk cFirstName cLastName } }"}' | jq
```

Example query for a connectivity check that runs a minimal read:

```graphql
query {
  customerHealth
}
```

## Schema (current)

- **`customers(limit: Int = 5)`** — Rows from the TPC-DS `CUSTOMER` table; `limit` is capped server-side.
- **`customerHealth`** — Returns `"ok"` after a trivial read against Snowflake (useful for smoke tests).

## Integration tests

Tests live under `tests/integration/`. They load `.env` from the **project root** and call **`POST /graphql`** with [supertest](https://github.com/ladjs/supertest). If required Snowflake variables are missing, the suite is **skipped** so CI or local clones without credentials still pass.

```bash
npm run test:integration
```

## Project layout

```
src/
  app.ts              # Express + Apollo middleware
  index.ts            # Entry: authenticate DB, listen
  bootstrap.ts        # Sequelize + model registration
  env.ts              # Env validation
  db/sequelize.ts     # Snowflake Sequelize factory
  models/customer.ts  # TPC-DS CUSTOMER mapping
  graphql/            # typeDefs + resolvers
tests/integration/    # HTTP + Snowflake integration tests
```

## References

- [Sequelize: Snowflake (experimental)](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#snowflake-experimental)
- [Apollo Server documentation](https://www.apollographql.com/docs/apollo-server/)
- [Apollo GraphQL](https://www.apollographql.com/) (platform overview)
- [Example: Apollo Server with PostgreSQL](https://medium.com/@heis007ryan/how-to-create-an-apollo-server-with-a-postgresql-db-dafa3ddc044b) — same layering pattern; this repo swaps the ORM database for Snowflake
