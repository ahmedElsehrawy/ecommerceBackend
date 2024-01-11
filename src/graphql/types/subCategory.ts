import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import { Category } from "./category";
import { checkAuth } from "../../utils/auth";
import {
  createSubCategoryInput,
  getOneSubCategoryWhereUniqueInput,
  getSubCategoriesWhereUniqueInput,
} from "../inputs";

export const SubCategory = objectType({
  name: "SubCategory",
  definition(t) {
    t.int("id");
    t.string("name");
    t.int("categoryId");
    t.field("category", { type: nonNull(Category) });
  },
});

export const createSubCategory = mutationField("createSubCategory", {
  type: nonNull(SubCategory),
  args: {
    input: nonNull(createSubCategoryInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    let auth = checkAuth(ctx);

    try {
      //@ts-ignore
      let subCategory = await ctx.prisma.subCategory.create({
        data: {
          ...args.input,
        },
        include: {
          category: true,
        },
      });

      if (!subCategory) {
        throw new Error("category Alreay exist");
      }

      return subCategory;
    } catch (error: any) {
      throw new Error(error);
    }
  },
});

export const getOneSubCategory = queryField("getOneSubCategory", {
  type: nonNull(SubCategory),
  args: {
    where: nonNull(getOneSubCategoryWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    let subCategory: any = await ctx.prisma.subCategory.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!subCategory) {
      throw new Error("no category found");
    }

    return subCategory;
  },
});

export const getSubCategories = queryField("getSubCategories", {
  type: nonNull(list(SubCategory)),
  args: {
    where: nonNull(getSubCategoriesWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    let subCategories: any = await ctx.prisma.subCategory.findMany({
      where: {
        categoryId: args.where.categoryId,
      },
    });

    if (!subCategories) {
      throw new Error("no category found");
    }

    return subCategories;
  },
});
