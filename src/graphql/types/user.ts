import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import { registerInput, UserWhereUniqueInput } from "../inputs";
import { Address } from "./address";
import { Cart } from "./cart";
import { Order } from "./order";

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("password");
    t.float("balance");
    t.string("phone");
    t.field("Address", { type: list(Address) });
    t.field("cart", { type: Cart });
    t.field("Order", { type: list(Order) });
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const user = queryField("user", {
  type: nonNull(User),
  args: {
    where: nonNull(UserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let user = await ctx.prisma.user.findUnique({
      where: {
        id: args.where.id,
      },
      include: {
        Address: true,
        cart: {
          include: {
            CartItem: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        Order: {
          include: {
            OrderItem: true,
            address: true,
          },
        },
      },
    });

    const cart = await ctx.prisma.cart.findUnique({
      where: {
        id: args.where.id,
      },
      include: {
        CartItem: true,
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

    let newCartItems = cartItems.map(async (item) => {
      let product = await ctx.prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      return {
        ...cartItems[0],
        productId: null,
        product: product,
      };
    });

    return {
      ...user,
      cart: {
        ...cart,
        CartItem: newCartItems,
        totalPrice: totalPrice.toFixed(2),
      },
    };
  },
});

export const register = mutationField("register", {
  type: nonNull(User),
  args: {
    input: nonNull(registerInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let createdUser = await ctx.prisma.user.create({
      data: {
        ...args.input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await ctx.prisma.cart.create({
      data: {
        userId: createdUser.id,
      },
    });

    return createdUser;
  },
});

export const deleteUser = mutationField("deleteUser", {
  type: nonNull(User),
  args: {
    where: nonNull(UserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: {
        userId: args.where.id,
      },
    });
    await ctx.prisma.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    await ctx.prisma.cart.delete({
      where: {
        userId: args.where.id,
      },
    });

    const orders = await ctx.prisma.order.findMany({
      where: {
        userId: args.where.id,
      },
    });

    let ordersIds = orders.map((order) => order.id);

    await ctx.prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: ordersIds,
        },
      },
    });

    await ctx.prisma.order.deleteMany({
      where: {
        userId: args.where.id,
      },
    });

    await ctx.prisma.address.deleteMany({
      where: {
        userId: args.where.id,
      },
    });

    return await ctx.prisma.user.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
