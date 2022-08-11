import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import {
  addCartItemInput,
  getCartWhereUniqueInput,
  removeCartItemWhereUniqueInput,
} from "../inputs/cartInput";

export const Cart = objectType({
  name: "Cart",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.float("totalPrice");
    t.nonNull.field("items", { type: list(CartItem) });
  },
});

export const CartItem = objectType({
  name: "CartItem",
  definition(t) {
    t.int("id");
    t.int("cartId");
    t.int("productId");
    t.int("quantity");
  },
});

export const addCartItem = mutationField("addCartItem", {
  type: nonNull(CartItem),
  args: {
    input: nonNull(addCartItemInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.cartItem.create({
      data: {
        ...args.input,
      },
    });
  },
});

export const removeCartItem = mutationField("removeCartItem", {
  type: nonNull(CartItem),
  args: {
    where: nonNull(removeCartItemWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.cartItem.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});

export const getCart = queryField("getCart", {
  type: nonNull(Cart),
  args: {
    where: nonNull(getCartWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: {
        id: args.where.userId,
      },
    });

    const cartItems = await ctx.prisma.cartItem.findMany({
      where: {
        cartId: cart?.id,
      },
    });
    let totalPrice: number = 0;
    const calculateTotalPrice = async (productId: number, quantity: number) => {
      let currentProduct = await ctx.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!currentProduct?.discountId) {
        totalPrice += Number(currentProduct?.price) * Number(quantity);
      } else {
        const discount = await ctx.prisma.discount.findUnique({
          where: {
            id: currentProduct.discountId,
          },
        });
        let priceAfterDiscount =
          Number(currentProduct.price) -
          (Number(currentProduct.price) * Number(discount?.percent)) / 100;

        totalPrice += Number(priceAfterDiscount) * Number(quantity);
      }
    };

    for (let i = 0; i < cartItems.length; i++) {
      await calculateTotalPrice(cartItems[i].productId, cartItems[i].quantity);
    }

    return {
      ...cart,
      totalPrice: totalPrice.toFixed(2),
      items: cartItems,
    };
  },
});
