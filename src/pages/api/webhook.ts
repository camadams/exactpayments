/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextApiRequest, type NextApiResponse } from 'next';
import axios from 'axios';

const token = process.env.WHATSAPP_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        let body = req.body;

        console.log(JSON.stringify(body, null, 2));

        if (body.object) {
            if (
                body.entry?.[0].changes?.[0]?.value.messages?.[0]
            ) {
                let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id as string;
                let from = body.entry[0].changes[0].value.messages[0].from as string;
                let msg_body = body.entry[0].changes[0].value.messages[0].text.body as string;

                try {
                    await axios.post(
                        `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`,
                        {
                            messaging_product: 'whatsapp',
                            to: from,
                            text: { body: `Ack: ${msg_body}` },
                        },
                        {
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            }
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    } else if (req.method === 'GET') {
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        console.log({ mode, token })
        if (mode && token) {
            if (mode === 'subscribe' && token === verifyToken) {
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            } else {
                res.status(403).end();
            }
        }
    } else {
        res.status(405).end();
    }
}
