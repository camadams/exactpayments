import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { EmailTemplate, type EmailTemplateProps } from '~/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.VERCEL)
    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['camgadams@gmail.com'],
            subject: 'My route',
            react: EmailTemplate(req.body as EmailTemplateProps),
        } as CreateEmailOptions);

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

export default a;
