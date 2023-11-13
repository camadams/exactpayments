import { type NextApiRequest, type NextApiResponse } from 'next';
import axios from 'axios';
import { type BillCustomerResult } from '~/server/api/routers/sale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const test = true;
    try {
        const billResultArr = req.body as BillCustomerResult[];

        const whatsappsToSend = billResultArr.map((billResult) => {
            return {
                to: test ? '27835542241' : billResult.customerEmail,
                text: billResult.textSummary,
            }
        });


        let respMsg = ""
        for (const whatsappToSend of whatsappsToSend) {
            const response = await axios.post(
                'https://graph.facebook.com/v17.0/156150637574431/messages',
                {
                    messaging_product: 'whatsapp',
                    recipient_type: "individual",
                    to: whatsappToSend.to,
                    type: 'text',
                    text: {
                        preview_url: false,
                        body: whatsappToSend.text
                    },
                },
                {
                    headers: {
                        Authorization: 'Bearer EAAPWZBZAzQ48ABO1O4LN5OcZB5Ri7Q87H2NCOvQh55E0KjMj6lvAWsYr14S5nYcJfWsZBz89cZBZBu6iUfGR0rFj560L0QVASgtqwWcoQxrSdZBikwaALA2f58i98T0saUnZBaryiPOvzHB0njaewLi0Ws46RSdDSk7sH7hLZBPessswb5Y19mErRnKxdnSkJVRWQ6M9z5OhGZCrQgYZC17',
                        'Content-Type': 'application/json',
                    },
                }
            );
            respMsg += response.data + '\n';
            console.log(response.data);
        }


        res.status(200).json(respMsg);
    } catch (error) {
        res.status(400).json(error);
    }
}
