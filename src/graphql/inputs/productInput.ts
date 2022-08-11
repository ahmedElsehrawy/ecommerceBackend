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

export const updateProdcutInput = inputObjectType({
  name: "updateProdcutInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.string("image");
    t.float("price");
    t.int("categoryId");
    t.int("discountId");
  },
});

export const updateProdcutWhereUniqueId = inputObjectType({
  name: "updateProdcutWhereUniqueId",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getProductInput = inputObjectType({
  name: "getProductInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getProductsInput = inputObjectType({
  name: "getProductsInput",
  definition(t) {
    t.nonNull.int("categoryId");
  },
});
