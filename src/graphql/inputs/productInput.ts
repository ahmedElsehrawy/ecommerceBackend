import { inputObjectType } from "nexus";

export const createProductInput = inputObjectType({
  name: "createProductInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.string("image");
    t.nonNull.float("price");
    t.nonNull.int("categoryId");
    t.int("discountId");
  },
});

export const getProductInput = inputObjectType({
  name: "getProductInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
