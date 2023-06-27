import { inputObjectType } from "nexus";

export const createCommentInput = inputObjectType({
  name: "createCommentInput",
  definition(t) {
    t.nonNull.int("commentOwnerId");
    t.nonNull.int("productId");
    t.nonNull.string("commentText");
  },
});

export const getCommentInput = inputObjectType({
  name: "getCommentInput",
  definition(t) {
    t.nonNull.id("commentId");
  },
});

export const getCommentsInput = inputObjectType({
  name: "getCommentsInput",
  definition(t) {
    t.nonNull.id("productId");
  },
});
