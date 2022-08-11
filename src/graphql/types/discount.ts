import { nonNull, objectType, queryField } from "nexus";
import { createDiscountInput } from "../inputs/discountInput";

export const Discount = objectType({
  name: "Discount",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.int("percent");
    t.nonNull.boolean("active");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

export const createDiscount = queryField("createDiscount", {
  type: nonNull(Discount),
  args: {
    input: nonNull(createDiscountInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.discount.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});
