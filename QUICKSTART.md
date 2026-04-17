# Quickstart

Get the GraphQL server talking to Snowflake sample TPC-DS data in a few minutes.

## 1. Install dependencies

From the project root:

```bash
npm install
```

## 2. Configure Snowflake

Copy the sample env file and edit values for your account:

```bash
cp .env.example .env
```

Set at least:

- `SNOWFLAKE_ACCOUNT` — your account locator (no `https://`)
- `SNOWFLAKE_USERNAME` / `SNOWFLAKE_PASSWORD`
- `SNOWFLAKE_WAREHOUSE` — a warehouse your user can use

Defaults already point at **`snowflake_sample_data`** and schema **`TPCDS_SF10TCL`**. Adjust `SNOWFLAKE_DATABASE`, `SNOWFLAKE_SCHEMA`, or `SNOWFLAKE_ROLE` if your account requires it.

## 3. Run the server

```bash
npm run dev
```

You should see a line like: `GraphQL ready at http://localhost:4000/graphql`.

## 4. Try a query

**Option A — curl**

```bash
curl -sS http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"query { customers(limit: 2) { cCustomerSk cFirstName cLastName } }"}'
```

**Option B — health check (no Snowflake)**

```bash
curl -sS http://localhost:4000/health
```

**Option C — GraphQL smoke read**

```bash
curl -sS http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"query { customerHealth }"}'
```

## 5. (Optional) Integration tests

With a valid `.env` in the project root:

```bash
npm run test:integration
```

If Snowflake variables are missing, Vitest **skips** the Snowflake tests instead of failing.

## 6. Production-style run

```bash
npm run build
npm start
```

---

Next: see [README.md](./README.md) for architecture notes, endpoint summary, and links to Sequelize and Apollo docs.
