import { inputObjectType, list } from "nexus";

export const productImage = inputObjectType({
  name: "productImage",
  definition(t) {
    t.nonNull.string("url");
  },
});

export const createProductInput = inputObjectType({
  name: "createProductInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.string("mainImage");
    t.field({ name: "gallery", type: list(productImage) });
    t.nonNull.float("price");
    t.nonNull.int("categoryId");
    t.int("discountId");
  },
});

export const updateProdcutInput = inputObjectType({
  name: "updateProdcutInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.string("image");
    t.float("price");
    t.int("categoryId");
    t.int("discountId");
  },
});

export const updateProdcutWhereUniqueId = inputObjectType({
  name: "updateProdcutWhereUniqueId",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getProductInput = inputObjectType({
  name: "getProductInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getProductsInput = inputObjectType({
  name: "getProductsInput",
  definition(t) {
    t.int("categoryId");
    t.string("name");
    t.int("vendorId");
  },
});
