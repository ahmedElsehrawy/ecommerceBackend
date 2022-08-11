import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import {
  createProductInput,
  getProductInput,
  getProductsInput,
  updateProdcutInput,
  updateProdcutWhereUniqueId,
} from "../inputs";

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
  //@ts-ignore
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

export const updateProdcut = mutationField("updateProdcut", {
  type: nonNull(Product),
  args: {
    input: nonNull(updateProdcutInput),
    productId: nonNull(updateProdcutWhereUniqueId),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.product
      .update({
        where: {
          id: args.productId.id,
        },
        //@ts-ignore
        data: {
          ...args.input,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .catch((error) => console.log(error));
  },
});

export const getProduct = queryField("getProduct", {
  type: nonNull(Product),
  args: {
    where: nonNull(getProductInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (product?.discountId) {
      const discount = await ctx.prisma.discount.findUnique({
        where: {
          id: product.discountId,
        },
      });
      if (discount?.active) {
        return {
          ...product,
          price:
            Number(product?.price) -
            (Number(product?.price) * discount.percent) / 100,
        };
      } else {
        return product;
      }
    }
  },
});

export const getProducts = queryField("getProducts", {
  type: nonNull(list(Product)),
  args: {
    where: nonNull(getProductsInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        categoryId: args.where.categoryId,
      },
    });
    let productsAfterCalculations = await products.map(async (product) => {
      let discountValue = 0;
      if (product.discountId) {
        let discount = await ctx.prisma.discount.findUnique({
          where: {
            id: product.discountId,
          },
        });
        discountValue = discount?.active ? discount.percent : 0;
      }
      return {
        ...product,
        price:
          Number(product.price) - (Number(product.price) * discountValue) / 100,
      };
    });
    return productsAfterCalculations;
  },
});

export const deleteProduct = mutationField("deleteProduct", {
  type: nonNull(Product),
  args: {
    where: nonNull(getProductInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.product.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
