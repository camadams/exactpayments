/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// pages/api/mailgun-webhook.ts

import { type NextApiRequest, type NextApiResponse } from 'next';

const a = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { from, subject, text } = req.body;
        // Process the incoming email data as needed
        console.log('From:', from);
        console.log('Subject:', subject);
        console.log('Message:', text);
        // Handle the reply logic here
        // Send a response to acknowledge receipt if required
        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).end();
    }
};

export default a;