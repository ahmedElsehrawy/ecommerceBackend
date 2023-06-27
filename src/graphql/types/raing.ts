import { arg, mutationField, nonNull, objectType } from "nexus";
import { User } from "./user";
import { Product } from "./product";
import { createRatingInput } from "../inputs/ratingInput";

export const Rating = objectType({
  name: "Rating",
  definition(t) {
    t.int("id");
    t.int("ratingValue");
    t.int("userId");
    t.field("user", { type: nonNull(User) });
    t.int("productId");
    t.field("product", { type: nonNull(Product) });
  },
});

export const createRating = mutationField("createRating", {
  type: nonNull(Rating),
  args: {
    input: nonNull(createRatingInput),
  },
  resolve: async (_root, args, ctx) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: args.input.productId },
    });

    if (!product) {
      throw new Error("Product Not Found maybe was deleted");
    }

    console.log("args", args);

    //@ts-ignore
    const newTotalRatingNetValue =
      product.totalRatingNetValue + args.input.ratingValue;
    //@ts-ignore
    const newRatingCounter = product?.ratingCounter + 1;

    await ctx.prisma.product.update({
      where: { id: args.input.productId },
      data: {
        //@ts-ignore
        averageRatingValue: Math.ceil(
          newTotalRatingNetValue / newRatingCounter
        ),
        //@ts-ignore
        ratingCounter: product.ratingCounter + 1,
        totalRatingNetValue: newTotalRatingNetValue,
      },
    });

    //@ts-ignore
    const rating = await ctx.prisma.rating.create({
      data: {
        ...args.input,
      },
      include: {
        user: true,
        product: true,
      },
    });

    return rating;
  },
});
