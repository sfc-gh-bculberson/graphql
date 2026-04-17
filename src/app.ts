import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import type { Sequelize } from "sequelize";
import { sequelize as defaultSequelize } from "./bootstrap.js";
import { createContext, type GraphqlContext } from "./context.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/typeDefs.js";
import type { Customer } from "./models/customer.js";

export async function createApp(sequelizeInstance: Sequelize = defaultSequelize) {
  const app = express();
  const CustomerModel = sequelizeInstance.models.Customer as typeof Customer;

  const server = new ApolloServer<GraphqlContext>({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => createContext(sequelizeInstance, CustomerModel),
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return { app, server };
}
