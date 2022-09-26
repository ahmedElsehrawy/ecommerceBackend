import { inputObjectType, list } from "nexus";

export const cartItemInput = inputObjectType({
  name: "cartItemInput",
  definition(t) {
    t.nonNull.int("productId");
    t.nonNull.int("quantity");
  },
});

export const createOrderInput = inputObjectType({
  name: "createOrderInput",
  definition(t) {
    t.nonNull.int("userId");
    t.nonNull.int("addressId");
    t.nonNull.field({ name: "products", type: list(cartItemInput) });
  },
});

export const getOrderInput = inputObjectType({
  name: "getOrderInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getOrdersInput = inputObjectType({
  name: "getOrdersInput",
  definition(t) {
    t.nonNull.int("userId");
  },
});
