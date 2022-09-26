import { inputObjectType } from "nexus";

export const getOrderItemsIdInput = inputObjectType({
  name: "getOrderItemsIdInput",
  definition(t) {
    t.nonNull.int("orderId");
  },
});

// export const createOrderItemInput = inputObjectType({
//   name: "createOrderItemInput",
//   definition(t) {
//    // t.nonNull.int("orderId");
//     t.nonNull.int("productId");
//     t.nonNull.int("quantity");
//   },
// });
