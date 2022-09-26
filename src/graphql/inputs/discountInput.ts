import { inputObjectType } from "nexus";

export const createDiscountInput = inputObjectType({
  name: "createDiscountInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.int("percent");
    t.nonNull.boolean("active", { default: false });
  },
});

export const updateDiscountInput = inputObjectType({
  name: "updateDiscountInput",
  definition(t) {
    t.string("name");
    t.int("percent");
    t.boolean("active", { default: false });
  },
});

export const updateDiscountWhereUniqueInput = inputObjectType({
  name: "updateDiscountWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const deleteDiscountWhereUniqeInput = inputObjectType({
  name: "deleteDiscountWhereUniqeInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
