import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  enumType,
  list,
} from "nexus";
import { createOrderInput, getOrderInput, getOrdersInput } from "../inputs";
import { Address } from "./address";
import { OrderItem } from "./orderItem";

export const Order = objectType({
  name: "Order",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.field("orderStatus", { type: OrderStatus });
    t.float("totalPrice");
    t.field("address", { type: nonNull(Address) });
    t.field("OrderItem", { type: list(OrderItem) });
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
  //@ts-ignore
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

export const getOneOrder = queryField("getOneOrder", {
  type: nonNull(Order),
  args: {
    where: nonNull(getOrderInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return await ctx.prisma.order.findUnique({
      where: {
        id: args.where.id,
      },
      include: {
        OrderItem: true,
        address: true,
      },
    });
  },
});

export const getManyOrders = queryField("getManyOrders", {
  type: nonNull(list(Order)),
  args: {
    where: nonNull(getOrdersInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.order.findMany({
      where: {
        userId: args.where.userId,
      },
    });
  },
});

export const deleteOrder = mutationField("deleteOrder", {
  type: nonNull(Order),
  args: {
    where: nonNull(getOrderInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.order.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
