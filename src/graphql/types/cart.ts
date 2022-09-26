import {
  list,
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
} from "nexus";
import { checkAuth } from "../../utils/auth";
import {
  addCartItemInput,
  removeCartItemWhereUniqueInput,
} from "../inputs/cartInput";
import { Product } from "./product";

export const Cart = objectType({
  name: "Cart",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.float("totalPrice");
    t.field("CartItem", { type: nullable(list(CartItem)) });
  },
});

export const CartItem = objectType({
  name: "CartItem",
  definition(t) {
    t.int("id");
    t.int("cartId");
    t.field("product", { type: Product });
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
    const userAuth = checkAuth(ctx);

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userAuth.id,
      },
      include: {
        cart: {
          include: {
            CartItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (
      user?.cart?.CartItem.find(
        (cartItem) => cartItem.product.id === args.input.productId
      )
    ) {
      let cartItem = user?.cart?.CartItem.find(
        (cartItem) => cartItem.product.id === args.input.productId
      );

      return ctx.prisma.cartItem.update({
        where: {
          //@ts-ignore
          id: cartItem.id,
        },
        data: {
          //@ts-ignore
          quantity: cartItem?.quantity + args.input.quantity,
        },
        include: {
          product: true,
        },
      });
    }

    return ctx.prisma.cartItem.create({
      data: {
        //@ts-ignore
        cartId: user.cart.id,
        ...args.input,
      },
      include: {
        product: true,
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

export const cartFunctionCalculator = async (
  _root: any,
  _args: any,
  ctx: any
) => {
  const user = checkAuth(ctx);

  const cart = await ctx.prisma.cart.findUnique({
    where: {
      id: user.id,
    },
    include: {
      CartItem: true,
    },
  });
  console.log("🚀 ~ file: cart.ts ~ line 99 ~ cart", cart);

  const cartItems = await ctx.prisma.cartItem.findMany({
    where: {
      cartId: cart?.id,
    },
    include: {
      product: true,
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
    CartItem: cartItems,
  };
};

export const getCart = queryField("getCart", {
  type: nonNull(Cart),
  args: {},
  //@ts-ignore
  resolve: (root, args, ctx) => cartFunctionCalculator(root, args, ctx),
});
