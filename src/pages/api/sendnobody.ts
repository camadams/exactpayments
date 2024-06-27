import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await resend.emails.send({
            from: 'Acmasdfasdfe <sadfasdf@erdsf.dev>',
            to: ['camgadams@gmail.com'],
            subject: 'My route',
            html: '<h1>hi</h1>',
        } as CreateEmailOptions);

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

export default a;
