import { list, nonNull, objectType, queryField, mutationField } from "nexus";
import { createOrderItemInput, getOrderItemsIdInput } from "../inputs";

export const OrderItem = objectType({
  name: "orderItem",
  definition(t) {
    t.int("id");
    t.int("orderId");
    t.int("productId");
    t.int("quantity");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const getOrderItems = queryField("getOrderItems", {
  type: nonNull(list(OrderItem)),
  args: {
    where: nonNull(getOrderItemsIdInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.orderItem.findMany({
      where: {
        orderId: args.where.orderId,
      },
    });
  },
});

export const createOrderItem = mutationField("createOrderItem", {
  type: nonNull(OrderItem),
  args: {
    input: nonNull(createOrderItemInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.orderItem.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});
