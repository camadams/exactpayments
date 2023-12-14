
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
export default async function f(req: NextApiRequest, res: NextApiResponse) {
    // const { mutate: create } = api.example.create.useMutation();
    const a = await prisma.example.create({ data: {} });

}