import {
  arg,
  extendType,
  intArg,
  list,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
} from "nexus";
import { checkAuth } from "../../utils/auth";
import { configureDate } from "../../utils/dates";
import {
  createProductInput,
  getProductInput,
  getProductsInput,
  updateProdcutInput,
  updateProdcutWhereUniqueId,
  getOneProductInput,
  getProductsOrderBy,
} from "../inputs";
import { Category } from "./category";
import { Inventory } from "./inventory";
import { Comment } from "./comment";

export const ProductImage = objectType({
  name: "ProductImage",
  definition(t) {
    t.int("id");
    t.string("url");
    t.field("product", { type: Product });
    t.int("productId");
  },
});

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("description");
    t.string("mainImage");
    t.field("Gallery", { type: list(ProductImage) });
    t.int("categoryId");
    t.int("vendorId");
    t.field("Inventory", { type: list(Inventory) });
    t.field("category", { type: Category });
    t.float("price");
    t.int("averageRatingValue");
    t.nullable.int("discountId");
    t.string("createdAt");
    t.string("updatedAt");
    t.field("Comment", { type: list(Comment) });
  },
});

export const createProduct = mutationField("createProduct", {
  type: nonNull(Product),
  args: {
    input: nonNull(createProductInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const user = await checkAuth(ctx);

    if (!user) {
      throw new Error("not authenticated");
    }
    console.log("🚀 ~ file: product.ts ~ line 66 ", user);

    //@ts-ignore
    if (user.role !== "VENDOR") {
      throw new Error("sorry not allowed fot this user");
    }

    const createdProduct = await ctx.prisma.product.create({
      data: {
        name: args.input.name,
        description: args.input.description,
        mainImage: args.input.mainImage,
        price: args.input.price,
        categoryId: args.input.categoryId,
        discountId: args.input.discountId ? args.input.discountId : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        vendorId: user.id,
      },
      include: {
        category: true,
        Gallery: true,
      },
    });
    console.log(
      "🚀 ~ file: product.ts ~ line 77 ~ resolve: ~ createdProduct",
      createdProduct
    );

    //@ts-ignore
    let images = args.input.gallery.map((image) => {
      return {
        ...image,
        productId: createdProduct.id,
      };
    });

    await ctx.prisma.productImage.createMany({
      //@ts-ignore
      data: images,
    });

    return ctx.prisma.product.findUnique({
      where: {
        id: createdProduct.id,
      },
      include: {
        category: true,
        Gallery: true,
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
    const user = checkAuth(ctx);

    const product = await ctx.prisma.product.findUnique({
      where: {
        id: args.productId.id,
      },
    });
    //@ts-ignore
    if (product?.vendorId !== user.id) {
      throw new Error("not allowed");
    }

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
        include: {
          category: true,
        },
      })
      .catch((error) => console.log(error));
  },
});

export const getProduct = queryField("product", {
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
      include: {
        category: true,
        Inventory: true,
        Gallery: true,
        //@ts-ignore
        Comment: {
          include: {
            user: true,
          },
        },
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
        console.log(product);

        return product;
      }
    } else {
      console.log(product);
      return product;
    }
  },
});

// export const getProducts = queryField("getProducts", {
//   type: nonNull(list(Product)),
//   args: {
//     where: nonNull(getProductsInput),
//   },
//   //@ts-ignore
//   resolve: async (_root, args, ctx) => {
//     const products = await ctx.prisma.product.findMany({
//       where: {
//         OR: [
//           //@ts-ignore
//           { categoryId: args.where.categoryId },
//           //@ts-ignore
//           { name: { contains: args.where.name } },
//           //@ts-ignore
//           { vendorId: args.where.vendorId },
//         ],
//       },
//       include: {
//         category: true,
//         Inventory: true,
//         Gallery: true,
//       },
//     });
//     let productsAfterCalculations = await products.map(async (product) => {
//       let discountValue = 0;
//       if (product.discountId) {
//         let discount = await ctx.prisma.discount.findUnique({
//           where: {
//             id: product.discountId,
//           },
//         });
//         discountValue = discount?.active ? discount.percent : 0;
//       }
//       return {
//         ...product,
//         price:
//           Number(product.price) - (Number(product.price) * discountValue) / 100,
//       };
//     });
//     return productsAfterCalculations;
//   },
// });

export const products = extendType({
  type: "Query",
  definition(t) {
    t.field("products", {
      type: objectType({
        name: "products",
        definition(t) {
          t.int("count");
          t.list.field("nodes", { type: Product });
        },
      }),
      //@ts-ignore
      args: {
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
        where: nonNull(getProductsInput),
        orderBy: nullable(getProductsOrderBy),
        //orderBy: arg({ type: "PostOrderByPrice" }),
      },
      //@ts-ignore
      resolve: async (_root, args, ctx) => {
        let filter: any = {
          skip: args.skip,
          take: args.take,
        };
        if (
          args.where?.categoryId ||
          args.where?.name ||
          args.where?.vendorId
        ) {
          filter = {
            skip: args.skip,
            take: args.take,
            where: {
              OR: [
                //@ts-ignore
                { categoryId: args.where.categoryId },
                //@ts-ignore
                {
                  name: {
                    contains: args.where.name?.toLowerCase(),
                    mode: "insensitive",
                  },
                },
                //@ts-ignore
                { vendorId: args.where.vendorId },
              ],
            },
          };
        }
        let nodes = await ctx.prisma.product.findMany({
          ...filter,
          orderBy: {
            price: args.orderBy?.price,
            createdAt: args?.orderBy?.createdAt,
          },
          include: {
            category: true,
            Inventory: true,
            Gallery: true,
            //@ts-ignore
            Comment: {
              include: {
                user: true,
                product: true,
              },
            },
          },
        });

        let getCountFilter = {};

        if (args.where?.categoryId) {
          getCountFilter = {
            where: {
              OR: [
                //@ts-ignore
                { categoryId: args.where.categoryId },
                //@ts-ignore
                { name: { contains: args.where.name } },
                //@ts-ignore
                { vendorId: args.where.vendorId },
              ],
            },
          };
        }

        let count = await ctx.prisma.product.count({ ...getCountFilter });

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

export const deleteProduct = mutationField("deleteProduct", {
  type: nonNull(Product),
  args: {
    where: nonNull(getProductInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const user = checkAuth(ctx);

    const product = await ctx.prisma.product.findUnique({
      where: {
        id: args.where.id,
      },
    });
    //@ts-ignore
    if (product?.vendorId !== user.id) {
      throw new Error("not allowed");
    }

    return ctx.prisma.product.delete({
      where: {
        id: args.where.id,
      },
      include: {
        category: true,
      },
    });
  },
});
