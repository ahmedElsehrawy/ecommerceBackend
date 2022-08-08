import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { createContext } from "./context";
import { schema } from "./schema";

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: schema,
    resolvers: {},
    context: createContext,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: process.env.PORT || 4000 });
    resolve();
  });

  console.log(
    `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  );
}

startApolloServer();
