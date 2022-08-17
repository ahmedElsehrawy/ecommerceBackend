import { inputObjectType } from "nexus";

export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const loginInput = inputObjectType({
  name: "loginInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const registerInput = inputObjectType({
  name: "createUserInput",
  definition(t) {
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("phone");
  },
});
