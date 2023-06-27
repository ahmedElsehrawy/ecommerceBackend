import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import {
  createCommentInput,
  getCommentInput,
  getCommentsInput,
} from "../inputs/commentInput";
import { Product } from "./product";
import { User } from "./user";

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.int("id");
    t.int("commentOwnerId"); // the id of the comment owner
    t.int("productId");
    t.field("product", { type: nonNull(Product) });
    t.field("user", { type: nonNull(User) });
    t.string("commentText");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const createComment = mutationField("createComment", {
  type: nonNull(Comment),
  args: {
    input: nonNull(createCommentInput),
  },
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    return ctx.prisma.comment.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  },
});

export const getComment = queryField("comment", {
  type: nonNull(Comment),
  args: {
    where: nonNull(getCommentInput),
  },
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    const comment = await ctx.prisma.comment.findUnique({
      where: {
        id: +args.where.commentId,
      },
      include: {
        user: true,
        product: true,
      },
    });

    console.log(comment);

    return comment;
  },
});

export const getComments = queryField("getComments", {
  type: nonNull(list(Comment)),
  args: {
    where: nonNull(getCommentsInput),
  },
  resolve: async (_root, args, ctx) => {
    //@ts-ignore
    const comments = await ctx.prisma.comment.findMany({
      where: {
        productId: +args.where.productId,
      },
      include: {
        user: true,
        product: true,
      },
    });

    return comments;
  },
});
