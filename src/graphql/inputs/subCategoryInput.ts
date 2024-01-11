import { inputObjectType } from "nexus";

export const createSubCategoryInput = inputObjectType({
  name: "createSubCategoryInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.int("categoryId");
  },
});

export const getOneSubCategoryWhereUniqueInput = inputObjectType({
  name: "getOneSubCategoryWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getSubCategoriesWhereUniqueInput = inputObjectType({
  name: "getSubCategoriesWhereUniqueInput",
  definition(t) {
    t.nonNull.int("categoryId");
  },
});
