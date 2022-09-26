import { inputObjectType } from "nexus";

export const getCartWhereUniqueInput = inputObjectType({
  name: "getCartWhereUniqueInput",
  definition(t) {
    t.nonNull.int("userId");
  },
});

export const addCartItemInput = inputObjectType({
  name: "addCartItemInput",
  definition(t) {
    t.nonNull.int("productId");
    t.nonNull.int("quantity");
  },
});

export const removeCartItemWhereUniqueInput = inputObjectType({
  name: "removeCartItemWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
