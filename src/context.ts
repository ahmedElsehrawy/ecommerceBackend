import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

export const createContext = async ({ req, res }: { req: any; res: any }) => ({
  prisma,
  req,
  res,
});
