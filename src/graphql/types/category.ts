import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import { createCategoryInput, getOneCategoryWhereUniqueInput } from "../inputs";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const createCategory = mutationField("createCategory", {
  type: nonNull(Category),
  args: {
    input: nonNull(createCategoryInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.category.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});

export const getOneCategory = queryField("getOneCategory", {
  type: nonNull(Category),
  args: {
    where: nonNull(getOneCategoryWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let category = await ctx.prisma.category.findUnique({
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

export const getCategories = queryField("getCategories", {
  type: nonNull(list(Category)),
  //@ts-ignore
  resolve: async (_root, _args, ctx) => {
    return ctx.prisma.category.findMany({});
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
