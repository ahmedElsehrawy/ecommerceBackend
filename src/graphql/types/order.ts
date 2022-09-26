import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  enumType,
  list,
  extendType,
  intArg,
} from "nexus";
import { checkAuth } from "../../utils/auth";
import { createOrderInput, getOrderInput, getOrdersInput } from "../inputs";
import { Address } from "./address";
import { OrderItem } from "./orderItem";
import { configureDate } from "../../utils/dates";
import { User } from "./user";

export const Order = objectType({
  name: "Order",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.field("orderStatus", { type: OrderStatus });
    t.field("user", { type: nonNull(User) });
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
    const user = checkAuth(ctx);
    const createdOrder = await ctx.prisma.order.create({
      data: {
        userId: args.input.userId,
        addressId: args.input.addressId,
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    //@ts-ignore
    let newOrderItemInput = args?.input?.products.map((item: any) => {
      return { ...item, orderId: createdOrder?.id };
    });

    await ctx.prisma.orderItem.createMany({
      //@ts-ignore
      data: newOrderItemInput,
    });
    const createdOrderItems = await ctx.prisma.orderItem.findMany({
      where: {
        orderId: createdOrder.id,
      },
      include: {
        product: true,
      },
    });

    const totalPrice = createdOrderItems.reduce(
      (accaccumulator: number, currentValue: any) =>
        accaccumulator + currentValue.quantity * currentValue.product.price,
      0
    );

    const cart = await ctx.prisma.cart.findUnique({
      where: {
        userId: user?.id,
      },
    });

    await ctx.prisma.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    return ctx.prisma.order.update({
      where: {
        id: createdOrder.id,
      },
      data: {
        totalPrice,
      },
      include: {
        address: true,
        OrderItem: {
          include: {
            product: true,
          },
        },
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
        OrderItem: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });
  },
});

export const getManyOrders = extendType({
  type: "Query",
  definition(t) {
    t.field("orders", {
      type: objectType({
        name: "orders",
        definition(t) {
          t.int("count");
          t.list.field("nodes", { type: Order });
        },
      }),
      args: {
        where: nonNull(getOrdersInput),
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_root, args, ctx) => {
        const nodes = await ctx.prisma.order.findMany({
          take: args.take,
          skip: args.skip,
          where: {
            userId: args.where.userId,
          },
        });

        const count = await ctx.prisma.order.count({
          where: {
            userId: args.where.userId,
          },
        });
        return {
          count,
          nodes,
        };
      },
    });
  },
});

export const getVendorOrders = extendType({
  type: "Query",
  definition(t) {
    t.field("vendorOrders", {
      type: objectType({
        name: "vendorOrders",
        definition(t) {
          t.int("count");
          t.list.field("nodes", { type: Order });
        },
      }),
      args: {
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_root, args, ctx) => {
        const auth = checkAuth(ctx);
        const nodes = await ctx.prisma.order.findMany({
          take: args.take,
          skip: args.skip,
          where: {
            OrderItem: {
              every: {
                product: {
                  vendorId: auth.id,
                },
              },
            },
          },
          include: {
            user: true,
            address: true,
            OrderItem: {
              include: {
                product: {
                  include: {
                    Gallery: true,
                  },
                },
              },
            },
          },
        });
        console.log("🚀 ~ file: order.ts ~ line 217 ~ resolve: ~ nodes", nodes);

        const count = await ctx.prisma.order.count({
          where: {
            OrderItem: {
              every: {
                product: {
                  vendorId: auth.id,
                },
              },
            },
          },
        });

        let newNodes = nodes.map((node) => {
          return {
            ...node,
            createdAt: configureDate(node.createdAt),
          };
        });
        return {
          count,
          nodes: newNodes,
        };
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
