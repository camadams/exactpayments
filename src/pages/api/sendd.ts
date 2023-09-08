import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";


export default async function POST() {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: "Acme <onboarding@resend.dev>",
            to: ["delivered@resend.dev"],
            subject: "hello world",
            html: "<strong>it works!</strong>",
        }),
    });

    if (res.ok) {
        const data: unknown = await res.json();
        return NextResponse.json(data);
    }
}