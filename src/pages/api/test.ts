import { type NextApiRequest, type NextApiResponse } from 'next';

const a = (req: NextApiRequest, res: NextApiResponse) => {
    // Your API logic here
    const data2 = {
        respp: "Hello, this is a sample API endpoint!",
        stuff: [0, 1, 2]
    };

    const data = "Hello, this is a sample API endpoint!";


    // Set the response status code to 200 (OK)
    res.status(200).json(data2);
};

export default a;   