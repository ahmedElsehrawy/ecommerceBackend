//@ts-ignore
import jwt from "jsonwebtoken";
//@ts-ignore
import { SECRET_KEY } from "../../config";

export const checkAuth = (context: any) => {
  const authHeader = context.req.headers.authorization;
  console.log(
    "🚀 ~ file: auth.ts ~ line 7 ~ checkAuth ~ authHeader",
    authHeader
  );

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new Error("Invalid/Expire token");
      }
    }
    throw new Error("bearer token not valid");
  }
};

export const generateToken = (createdUser: any) => {
  return jwt.sign(
    {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    },
    SECRET_KEY,
    { expiresIn: "365d" }
  );
};
