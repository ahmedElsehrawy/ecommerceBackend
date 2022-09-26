import { objectType } from "nexus";
import { Product } from "./product";

export const Inventory = objectType({
  name: "Inventory",
  definition(t) {
    t.int("id");
    t.int("productId");
    t.int("quantity");
    t.field("product", { type: Product });
    t.nullable.string("size");
    t.nullable.string("color");
  },
});
