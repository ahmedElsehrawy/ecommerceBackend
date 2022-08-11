import { inputObjectType } from "nexus";

export const createDiscountInput = inputObjectType({
  name: "createDiscountInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.int("percent");
    t.nonNull.boolean("active", { default: false });
  },
});
