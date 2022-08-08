import { mutationField, nonNull, objectType } from "nexus";
import { createCategoryInput } from "../inputs";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const createCategory = mutationField("createCategory", {
  type: nonNull(Category),
  args: {
    input: nonNull(createCategoryInput),
  },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.category.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
});
