import { NextResponse } from "next/server";
import { EmailTemplate, type EmailTemplateProps } from "~/components/email-template";

export const runtime = "edge";
export const dynamic = "force-dynamic";


export default async function POST(a: EmailTemplateProps) {
    console.log("inside api/sendd.ts");
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
            Authorization: `Bearer re_K1Ub8jGj_98L6T2F9o3dZLadspV8FKAnE`
        },
        body: JSON.stringify({
            from: "Acme <onboarding@resend.dev>",
            to: ["delivered@resend.dev"],
            subject: "new route",
            react: EmailTemplate(a),
        }),
    });

    if (res.ok) {
        const data: unknown = await res.json();
        return NextResponse.json(data);
    }
}