import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { createContext } from "./context";
import { schema } from "./schema";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import cors from "cors";
//@ts-ignore
import cookieParser from "cookie-parser";

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  // Use cookie-parser middleware
  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: schema,
    csrfPrevention: true,
    introspection: true,
    cache: "bounded",
    context: createContext,
    plugins: [ApolloServerPluginLandingPageLocalDefault],
  });

  const corsOptions = {
    origin: true,
    credentials: true,
  };

  const PORT = process.env.PORT || 4000;

  app.use(cors(corsOptions));

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT });
    resolve();
  });

  console.log(
    `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  );
}

startApolloServer();
