import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  enumType,
} from "nexus";
import { createOrderInput, getOrderInput } from "../inputs";

export const Order = objectType({
  name: "Order",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.field("orderStatus", { type: OrderStatus });
    t.float("totalPrice");
    t.int("addressId");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const OrderStatus = enumType({
  name: "OrderStatus",
  members: ["ONGOING", "COMPLETED", "CANCELED"],
  description: "The first Star Wars episodes released",
});

export const createOrder = mutationField("createOrder", {
  type: nonNull(Order),
  args: {
    input: nonNull(createOrderInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.order.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});

export const getOrder = queryField("getOrder", {
  type: nonNull(Order),
  args: {
    where: nonNull(getOrderInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.order.findUnique({
      where: {
        id: args.where.id,
      },
    });
  },
});
