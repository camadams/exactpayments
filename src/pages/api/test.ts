import type { NextApiRequest, NextApiResponse } from 'next';

const a = (req: NextApiRequest, res: NextApiResponse) => {
    res.send("<h1>hi</h1>");
};

export default a;
