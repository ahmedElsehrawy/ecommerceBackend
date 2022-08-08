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
