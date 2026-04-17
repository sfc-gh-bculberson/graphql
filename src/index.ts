import { createApp } from "./app.js";
import { sequelize } from "./bootstrap.js";
import { port } from "./env.js";

async function main() {
  await sequelize.authenticate();
  const { app } = await createApp(sequelize);
  app.listen(port, () => {
    console.log(`GraphQL ready at http://localhost:${port}/graphql`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
