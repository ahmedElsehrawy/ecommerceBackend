import { list, mutationField, nonNull, objectType, queryField } from "nexus";
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
    return ctx.prisma.address.findUnique({
      where: {
        id: args.where.id,
      },
    });
  },
});

export const deleteAddress = mutationField("deleteAddress", {
  type: nonNull(Address),
  args: {
    where: nonNull(getUserWhereUniqueInput),
  },
  //@ts-ignore
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.address.delete({
      where: {
        id: args.where.id,
      },
    });
  },
});
