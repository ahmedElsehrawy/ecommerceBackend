import { inputObjectType } from "nexus";

export const createCategoryInput = inputObjectType({
  name: "createCategoryInput",
  definition(t) {
    t.nonNull.string("name");
  },
});

export const getOneCategoryWhereUniqueInput = inputObjectType({
  name: "getOneCategoryWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
