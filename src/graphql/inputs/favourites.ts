import { inputObjectType } from "nexus";

export const addToFavouriteInput = inputObjectType({
  name: "addToFavouriteInput",
  definition(t) {
    t.nonNull.int("userId");
    t.nonNull.int("productId");
  },
});

export const removeFromFavouritesInput = inputObjectType({
  name: "removeFromFavouritesInput",
  definition(t) {
    t.nonNull.int("productId");
  },
});
