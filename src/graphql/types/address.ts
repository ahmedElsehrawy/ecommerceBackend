import { list, mutationField, nonNull, objectType, queryField } from "nexus";
import { checkAuth } from "../../utils/auth";
import {
  createAddressInput,
  getUserAddressesInput,
  getUserWhereUniqueInput,
} from "../inputs";

export const Address = objectType({
  name: "Address",
  definition(t) {
    t.int("id");
    t.int("userId");
    t.string("country");
    t.string("city");
    t.string("postalCode");
    t.string("telephone");
    t.string("street");
    t.string("houseNumber");
  },
});

export const createAddress = mutationField("createAddress", {
  type: nonNull(Address),
  args: {
    input: nonNull(createAddressInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.address.create({
      data: {
        ...args.input,
      },
      include: {
        user: true,
      },
    });
  },
});

export const getUserAddresses = queryField("getUserAddresses", {
  type: nonNull(list(Address)),
  args: {
    where: nonNull(getUserAddressesInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.address.findMany({
      where: {
        userId: args.where.userId,
      },
    });
  },
});

export const getOneAddress = queryField("getOneAddress", {
  type: nonNull(Address),
  args: {
    where: nonNull(getUserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    let address = await ctx.prisma.address.findUnique({
      where: {
        id: args.where.id,
      },
    });

    if (!address) {
      throw new Error("address not Found");
    }

    return address;
  },
});

export const deleteAddress = mutationField("deleteAddress", {
  type: nonNull(Address),
  args: {
    where: nonNull(getUserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    const user = checkAuth(ctx);
    const address = await ctx.prisma.address.findUnique({
      where: {
        id: args.where.id,
      },
    });
    //@ts-ignore
    if (address?.userId !== user?.id) {
      throw new Error("not allowed to do that");
    }
    return ctx.prisma.address.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
