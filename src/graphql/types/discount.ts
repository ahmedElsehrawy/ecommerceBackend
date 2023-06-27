import {
  extendType,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from "nexus";
import { checkAuth } from "../../utils/auth";
import {
  createDiscountInput,
  deleteDiscountWhereUniqeInput,
  updateDiscountInput,
  updateDiscountWhereUniqueInput,
} from "../inputs/discountInput";
import { User } from "./user";

export const Discount = objectType({
  name: "Discount",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.int("percent");
    t.nonNull.boolean("active");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.nonNull.int("vendorId");
    t.field("vendor", { type: User });
  },
});

export const createDiscount = mutationField("createDiscount", {
  type: nonNull(Discount),
  args: {
    input: nonNull(createDiscountInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const auth = checkAuth(ctx);
    return ctx.prisma.discount.create({
      data: {
        ...args.input,
        vendorId: auth.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});

export const updateDiscount = mutationField("updateDiscount", {
  type: nonNull(Discount),
  args: {
    input: nonNull(updateDiscountInput),
    where: nonNull(updateDiscountWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.discount.update({
      where: {
        id: args.where.id,
      },
      //@ts-ignore
      data: {
        ...args.input,
      },
    });
  },
});

export const getOneDiscount = queryField("getDiscount", {
  type: nonNull(Discount),
  args: {
    where: nonNull(updateDiscountWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.discount.findUnique({
      where: {
        id: args.where.id,
      },
    });
  },
});

export const discounts = extendType({
  type: "Query",
  definition(t) {
    t.field("discounts", {
      type: objectType({
        name: "discounts",
        definition(t) {
          t.int("count"), t.list.field("nodes", { type: Discount });
        },
      }),
      args: {
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_root, args, ctx) => {
        const auth = checkAuth(ctx);
        //@ts-ignore
        let nodes = await ctx.prisma.discount.findMany({
          where: {
            vendorId: auth.id,
          },
          skip: args.skip,
          take: args.take,
        });

        const count = await ctx.prisma.discount.count({
          where: {
            vendorId: auth.id,
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

export const deleteDiscount = mutationField("deleteDiscount", {
  type: nonNull(Discount),
  args: {
    where: nonNull(deleteDiscountWhereUniqeInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.discount.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
