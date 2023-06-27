import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import { checkAuth } from "../../utils/auth";
import {
  addToFavouriteInput,
  removeFromFavouritesInput,
} from "../inputs/favourites";
import { Product } from "./product";
import { User } from "./user";

export const Favourite = objectType({
  name: "Favourite",
  definition(t) {
    t.int("id");
    t.field("user", { type: User });
    t.field("product", { type: Product });
  },
});

export const addAsFavourite = mutationField("AddAsFavourite", {
  type: nonNull(Favourite),
  args: {
    input: nonNull(addToFavouriteInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const user = await checkAuth(ctx);

    const favourites = await ctx.prisma.favourite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    if (favourites.find((item) => item.productId === args.input.productId)) {
      throw new Error("product Already Found");
    }

    //@ts-ignore
    return ctx.prisma.favourite.create({
      data: {
        ...args.input,
      },
      include: {
        product: true,
        user: true,
      },
    });
  },
});

export const removeFromFavourites = mutationField("removeFromFavourites", {
  type: nonNull(Favourite),
  args: {
    where: nonNull(removeFromFavouritesInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const auth = await checkAuth(ctx);

    const favourite = await ctx.prisma.favourite.findFirst({
      where: {
        AND: [{ productId: args.where.productId }, { userId: auth.id }],
      },
    });
    console.log(
      "🚀 ~ file: favourites.ts ~ line 51 ~ resolve: ~ favourite",
      favourite
    );

    //@ts-ignore
    return ctx.prisma.favourite.delete({
      where: {
        //@ts-ignore
        id: favourite.id,
      },
      include: {
        product: true,
        user: true,
      },
    });
  },
});

export const getFavourites = queryField("getFavourites", {
  type: nonNull(list(Favourite)),
  //@ts-ignore
  resolve: async (_root, _args, ctx) => {
    const auth = checkAuth(ctx);
    //@ts-ignore
    return ctx.prisma.favourite.findMany({
      where: {
        userId: auth?.id,
      },
      include: {
        product: true,
        user: true,
      },
    });
  },
});
