import { list, nonNull, objectType, queryField, mutationField } from "nexus";
import { createOrderItemInput, getOrderItemsIdInput } from "../inputs";
import { Product } from "./product";

export const OrderItem = objectType({
  name: "orderItem",
  definition(t) {
    t.int("id");
    t.int("orderId");
    t.field("product", { type: Product });
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
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.orderItem.findMany({
      where: {
        orderId: args.where.orderId,
      },
      include: {
        product: true,
      },
    });
  },
});

export const createOrderItem = mutationField("createOrderItem", {
  type: nonNull(OrderItem),
  args: {
    input: nonNull(createOrderItemInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.orderItem.create({
      //@ts-ignore
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        product: true,
      },
    });
  },
});
