import { inputObjectType } from "nexus";
import { OrderStatus } from "../types";

export const createOrderInput = inputObjectType({
  name: "createOrderInput",
  definition(t) {
    t.nonNull.int("userId");
    t.nonNull.float("totalPrice");
    t.nonNull.int("addressId");
    t.nonNull.field("orderStatus", { type: OrderStatus });
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
