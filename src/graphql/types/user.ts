import { mutationField, nonNull, objectType, queryField } from "nexus";
import { registerInput, UserWhereUniqueInput } from "../inputs";

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("password");
    t.float("balance");
    t.string("phone");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const user = queryField("user", {
  type: nonNull(User),
  args: {
    where: nonNull(UserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: args.where.id,
      },
    });
  },
});

export const register = mutationField("register", {
  type: nonNull(User),
  args: {
    input: nonNull(registerInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let createdUser = await ctx.prisma.user.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await ctx.prisma.cart.create({
      data: {
        userId: createdUser.id,
      },
    });

    return createdUser;
  },
});

export const deleteUser = mutationField("deleteUser", {
  type: nonNull(User),
  args: {
    where: nonNull(UserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: {
        userId: args.where.id,
      },
    });
    await ctx.prisma.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    await ctx.prisma.cart.delete({
      where: {
        userId: args.where.id,
      },
    });

    const orders = await ctx.prisma.order.findMany({
      where: {
        userId: args.where.id,
      },
    });

    let ordersIds = orders.map((order) => order.id);

    await ctx.prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: ordersIds,
        },
      },
    });

    await ctx.prisma.order.deleteMany({
      where: {
        userId: args.where.id,
      },
    });

    await ctx.prisma.address.deleteMany({
      where: {
        userId: args.where.id,
      },
    });

    return await ctx.prisma.user.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
