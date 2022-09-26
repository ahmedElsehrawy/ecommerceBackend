import { list, nonNull, objectType, queryField } from "nexus";
import { getOrderItemsIdInput } from "../inputs";
import { Product } from "./product";

export const OrderItem = objectType({
  name: "orderItem",
  definition(t) {
    t.int("id");
    t.int("orderId");
    t.field("product", { type: Product });
    t.int("quantity");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const getOrderItems = queryField("getOrderItems", {
  type: nonNull(list(OrderItem)),
  args: {
    where: nonNull(getOrderItemsIdInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.orderItem.findMany({
      where: {
        orderId: args.where.orderId,
      },
      include: {
        product: true,
      },
    });
  },
});
