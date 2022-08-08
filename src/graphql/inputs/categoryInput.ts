import { inputObjectType } from "nexus";

export const createCategoryInput = inputObjectType({
  name: "createCategoryInput",
  definition(t) {
    t.nonNull.string("name");
  },
});
