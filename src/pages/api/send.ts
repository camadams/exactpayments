import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { EmailTemplate, type BillResult } from '~/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['camgadams@gmail.com'],
            subject: 'My route',
            react: EmailTemplate(req.body as BillResult),
        } as CreateEmailOptions);
        console.log(data.id)
        res.status(200).send(data.id);
    } catch (error) {
        res.status(400).json(error);
    }
};

export default a;
