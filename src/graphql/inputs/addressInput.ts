import { inputObjectType } from "nexus";

export const createAddressInput = inputObjectType({
  name: "createAddressInput",
  definition(t) {
    t.nonNull.int("userId");
    t.nonNull.string("country");
    t.nonNull.string("city");
    t.nonNull.string("postalCode");
    t.nonNull.string("telephone");
    t.nonNull.string("street");
    t.nonNull.string("houseNumber");
  },
});

export const getUserAddressesInput = inputObjectType({
  name: "getUserAddressesInput",
  definition(t) {
    t.nonNull.int("userId");
  },
});

export const getUserWhereUniqueInput = inputObjectType({
  name: "getUserWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});
