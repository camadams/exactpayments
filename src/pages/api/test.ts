import { type NextApiRequest, type NextApiResponse } from 'next';
import { prisma } from '~/server/db';

const a = async (req: NextApiRequest, res: NextApiResponse) => {
    // Your API logic here

    const countt = await prisma.billCustomerResult.count({ where: { firstName: "HangTen" } });

    const data2 = {
        respp: "Hello, this is a sample API endpoint!",
        stuff: [0, 1, 2]
    };

    const data = "Hello, this is a sample API endpoint!";


    // Set the response status code to 200 (OK)
    res.status(200).json({ countt });
};

export default a;   