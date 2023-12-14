import { type NextApiRequest, type NextApiResponse } from 'next';
import axios from 'axios';
import { type BillCustomerResult } from "~/com/sheetspro/BillCustomerResult";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const test = true;
    try {
        const billResultArr = req.body as BillCustomerResult[];
        console.log(billResultArr)
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
                        Authorization: 'Bearer EAAPWZBZAzQ48ABOwviUK0dcKZBZBcfbn7ZALPBo8O4i6gHA33ZA3XjqClDAguxtn4ASSvfLESF13cXZB6ZAhjqh12hIZCxQcnxePjwrBwJjwuLJZA9sTdX4Svvqll6ZAvm9sKH5uZAAUJDZCmEe3yJFYueEWHzBUc53ZBhWdr6Ktih7sleAuu5neCk7RIjpHstPAVZA5GcJHXDO0Sjv6CeqKPHL',
                        'Content-Type': 'application/json',
                    },
                }
            );
            respMsg += response.data + '\n';
            console.log(respMsg);
            break;
        }


        res.status(200).json(respMsg);
    } catch (error) {
        res.status(400).json(error);
    }
}
