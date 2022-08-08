import { makeSchema, declarativeWrappingPlugin } from "nexus";
import { applyMiddleware } from "graphql-middleware";
import path from "path";
import * as types from "./graphql/types";

export const schema = applyMiddleware(
  makeSchema({
    types,
    plugins: [declarativeWrappingPlugin({ disable: true })],
    outputs: {
      schema: path.join(__dirname, "../schema.graphql"),
      typegen: path.join(__dirname, "../schema-typegen.ts"),
    },
    contextType: {
      module: require.resolve("./context.ts"),
      alias: "Context",
      export: "Context",
    },
    nonNullDefaults: {
      output: true,
    },
  })
);
