import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { EmailTemplate, } from '~/components/email-template';
import fs from 'fs';
import { BillCustomerResult } from '~/utils/businessLogic';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        // let x: Buffer = Buffer.alloc(0);
        // fs.readFile("C:/tosend.pdf", (err, data) => {
        //     if (err) {
        //         console.error('Error reading file:', err);
        //         return;
        //     }
        //     x = data;

        //     // 'data' now contains the contents of the file as a Buffer
        //     console.log('File contents as Buffer:', data);
        // });

        const billResult = req.body as BillCustomerResult;

        // const pdfBuffer = fs.readFileSync(billResult.filename);

        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            // from: 'Emz <billing@mail.emzbakery.com>',
            to: ['camgadams@gmail.com'],
            subject: 'My routeee',
            text: 'Hi \nPlease send attachment \nKind regards.',
            html: '<h1>Hi</h1><p>tosend.pdf is here</p><p>Kind regards.</p>',
            // attachments: [{ filename: billResult.filename, content: pdfBuffer }],
            // reply_to: 'èmzveganbaking.com' uncomment for reply to
            // react: EmailTemplate(billResult),
        } as CreateEmailOptions);
        console.log(data.id)
        res.status(200).send(data.id);
    } catch (error) {
        res.status(400).json(error);
    }


};

export default a;
