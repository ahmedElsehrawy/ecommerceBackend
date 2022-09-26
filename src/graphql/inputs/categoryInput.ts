import { inputObjectType } from "nexus";

export const createCategoryInput = inputObjectType({
  name: "createCategoryInput",
  definition(t) {
    t.nonNull.string("name");
  },
});

export const updateCategoryInput = inputObjectType({
  name: "updateCategoryInput",
  definition(t) {
    t.nonNull.string("name");
  },
});

export const updateCategoryWhereUniqueInput = inputObjectType({
  name: "updateCategoryWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const getOneCategoryWhereUniqueInput = inputObjectType({
  name: "getOneCategoryWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
