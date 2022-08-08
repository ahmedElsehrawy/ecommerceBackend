import { inputObjectType } from "nexus";

export const getOrderItemsIdInput = inputObjectType({
  name: "getOrderItemsIdInput",
  definition(t) {
    t.nonNull.int("orderId");
  },
});

export const createOrderItemInput = inputObjectType({
  name: "createOrderItemInput",
  definition(t) {
    t.int("orderId");
    t.int("productId");
    t.int("quantity");
  },
});
