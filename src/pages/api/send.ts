import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { type BillCustomerResult } from '~/server/api/routers/sale';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {

    const test = true;
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

        const billResultArr = req.body as BillCustomerResult[];
        console.log(billResultArr);
        const billResult = billResultArr[0];

        const createEmailOptions: CreateEmailOptions[] = billResultArr.map((billResult) => {
            return {
                from: test ? 'Acme <onboarding@resend.dev>' : 'Emz <billing@mail.emzbakery.com>',
                to: [test ? 'camgadams@gmail.com' : billResult.customerEmail],
                subject: `Emz Bakery Invoice ${billResult.invoiceNumber} `,
                text: billResult.textSummary,
            } as CreateEmailOptions
        }
        );

        for (const createEmailOption of createEmailOptions) {
            const data = await resend.emails.send(createEmailOption);
            console.log(data.id)
        }
        // const data = await resend.emails.send();
        // console.log(data.id)
        // res.status(200).send(data.id);
    } catch (error) {
        res.status(400).json(error);
    }


};

export default a;


/*

            from: test ? 'Acme <onboarding@resend.dev>' : 'Emz <billing@mail.emzbakery.com>',
            to: [test ? 'camgadams@gmail.com' : billResult.customerEmail],
            subject: test ? `Invoice ${billResult.invoiceNumber} ` : `Invoice ${billResult.invoiceNumber} `,
            text: `Hi x`,
            html: '<h1>Hi</h1><p>tosend.pdf is here</p><p>Kind regards.</p>',


            text: `Hi ${billResult.firstName}
            Please note from ${format(billResult.billFromDate, "eee d MMM")} - ${format(billResult.billToDate, "eee d MMM")} you received the following items:
            ${billResult.invoiceLines.map((line) => {
                return `${line.quantity} x ${line.description} @ ${line.unitPrice} = ${line.total}`;
            }).join("\n")}
            Total: ${billResult.grandTotal}
            Please pay as soon as possible.
            Kind regards,
            Emz x`,


                        ${billResult.invoiceLines.map((line) => {
                return `${line.quantity} x ${line.description} @ ${line.unitPrice} = ${line.total}`;
            }).join("\n")}


                    const createEmailOptions: CreateEmailOptions[] = billResult.map((billResult) => {
            return {

                from: 'Acme <onboarding@resend.dev>',
                // from: 'Emz <billing@mail.emzbakery.com>',
                to: ['camgadams@gmail.com'],
                subject: test ? `Invoice ${billResult.invoiceNumber} ` : `Invoice ${billResult.invoiceNumber} `,
                // text: `Hi ${billResult.firstName}
                // Please note from ${fromDate} -  you received the following items:

                // Total: ${billResult.grandTotal}
                // Please pay as soon as possible.
                // Kind regards,
                // Emz x`,     

                text: billResult.textSummary,

                // html: '<h1>Hi</h1><p>tosend.pdf is here</p><p>Kind regards.</p>',
                // attachments: [{ filename: billResult.filename, content: pdfBuffer }],
                // reply_to: 'èmzveganbaking.com' uncomment for reply to
                // react: EmailTemplate(billResult),
            } as CreateEmailOptions
        }
        );

            */