// /app/api/send-invoice/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { toEmail, subject, html } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Invoices <invoice>",
      to: toEmail,
      subject,
      html,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : err },
      { status: 500 }
    );
  }
}
