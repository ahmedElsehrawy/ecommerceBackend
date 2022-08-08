import { mutationField, nonNull, objectType } from "nexus";
import { createAddressInput } from "../inputs";

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
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.address.create({
      data: {
        ...args.input,
      },
    });
  },
});
