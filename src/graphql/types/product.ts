import { mutationField, nonNull, objectType, queryField } from "nexus";
import { createProductInput, getProductInput } from "../inputs";

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("description");
    t.string("image");
    t.int("categoryId");
    t.float("price");
    t.nullable.int("discountId");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const createProduct = mutationField("createProduct", {
  type: nonNull(Product),
  args: {
    input: nonNull(createProductInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.product.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});

export const getProduct = queryField("getProduct", {
  type: nonNull(Product),
  args: {
    where: nonNull(getProductInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.product.findUnique({
      where: {
        id: args.where.id,
      },
    });
  },
});
