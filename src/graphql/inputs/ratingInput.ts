import { inputObjectType } from "nexus";

export const createRatingInput = inputObjectType({
  name: "createRatingInput",
  definition(t) {
    t.nonNull.int("ratingValue");
    t.nonNull.int("userId");
    t.nonNull.int("productId");
  },
});
