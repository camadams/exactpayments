import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { type BillCustomerResult } from '~/com/sheetspro/BillCustomerResult';
import { prisma } from '~/server/db';

const resend = new Resend(process.env.RESEND_API_KEY);

const a = async (req: NextApiRequest, res: NextApiResponse) => {

    const test = true;

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

    const billResults = req.body as BillCustomerResult[];

    if (!billResults) {
        res.status(400).json({ msg: "no body" });
        return;
    }
    for (const billResult of billResults) {
        if (billResult.grandTotal == 0) continue;
        const email: CreateEmailOptions = {
            from: test ? 'Acme <onboarding@resend.dev>' : 'Emz <billing@mail.emzbakery.com>',
            to: test ? 'camgadams@gmail.com' : billResult.customerEmail,
            subject: `Emz Bakery Invoice ${billResult.invoiceNumber}`,
            text: billResult.textSummary,
        }
        const data = await resend.emails.send(email);
        // console.log({ data })
        // console.log({ billResult })

        const bb = await prisma.billCustomerResult.create({
            data: {
                ...billResult,
                invoiceLines: {
                    create: billResult.invoiceLines
                        .filter((line) => line.quantity > 0)
                        .map((line) => ({
                            description: line.description,
                            quantity: line.quantity,
                            unitPrice: line.unitPrice,
                            total: line.total,
                        })),
                },
            }
        })
        // console.log({ bb })
        // const y = await prisma.billCustomerResult.create({ data: {} })
        // const { data: x, mutate: createBillCustomerResult } = api.billCustomerResult.create.useMutation();
        // createBillCustomerResult(billResult);
        // console.log({ x })
        // const { mutate: create } = api.example.create.useMutation();
        // create();
        // break;
    }


    // const data = await resend.emails.send();
    // console.log(data.id)
    res.status(200).json({ message: 'no error.' });



};

export default a;

function parseDateFromString(dateString: string): Date {
    const year = parseInt((dateString || "").slice(4, 6), 10) + 2000; // Add 2000 to get the full year
    const month = parseInt((dateString || "").slice(2, 4), 10) - 1; // Month is zero-based
    const day = parseInt((dateString || "").slice(0, 2), 10);

    return new Date(year, month, day);
}



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