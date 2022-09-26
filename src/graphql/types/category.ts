import {
  extendType,
  intArg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { checkAuth } from "../../utils/auth";

import { configureDate } from "../../utils/dates";
import {
  createCategoryInput,
  getOneCategoryWhereUniqueInput,
  updateCategoryInput,
  updateCategoryWhereUniqueInput,
} from "../inputs";
import { User } from "./user";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("createdAt");
    t.string("updatedAt");
    t.int("ownerId");
    t.field("owner", { type: nonNull(User) });
  },
});

export const createCategory = mutationField("createCategory", {
  type: nonNull(Category),
  args: {
    input: nonNull(createCategoryInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let auth = checkAuth(ctx);

    let category = await ctx.prisma.category.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: auth.id,
      },
    });

    if (!category) {
      throw new Error("category Alreay exist");
    }

    return category;
  },
});

export const updateCategory = mutationField("updateCategory", {
  type: nonNull(Category),
  args: {
    input: nonNull(updateCategoryInput),
    where: nonNull(updateCategoryWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let category = await ctx.prisma.category.update({
      where: {
        id: args.where.id,
      },
      data: {
        ...args.input,
      },
    });

    if (!category) {
      throw new Error("category Alreay exist");
    }

    return category;
  },
});

export const getOneCategory = queryField("getOneCategory", {
  type: nonNull(Category),
  args: {
    where: nonNull(getOneCategoryWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let category: any = await ctx.prisma.category.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!category) {
      throw new Error("no category found");
    }

    return category;
  },
});

export const categories = extendType({
  type: "Query",
  definition(t) {
    t.field("categories", {
      type: objectType({
        name: "categories",
        definition(t) {
          t.int("count");
          t.list.field("nodes", { type: Category });
        },
      }),
      //@ts-ignore
      args: {
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
        name: stringArg(),
      },
      //@ts-ignore
      resolve: async (_root, args, ctx) => {
        let nodes = await ctx.prisma.category.findMany({
          skip: args.skip,
          take: args.take,
          where: {
            //@ts-ignore
            name: { contains: args.name },
          },
        });

        let count = await ctx.prisma.category.count({});

        let customizedNodes: any = nodes.map((node: any) => {
          return {
            ...node,
            createdAt: configureDate(node.createdAt),
            updatedAt: configureDate(node.updatedAt),
          };
        });
        return {
          count,
          nodes: customizedNodes,
        };
      },
    });
  },
});

export const deleteCategory = mutationField("deleteCategory", {
  type: nonNull(Category),
  args: {
    where: nonNull(getOneCategoryWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.category.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
