import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html, link } = await req.json();

    if (!to) {
      return NextResponse.json({ success: false, error: "Missing recipient email" });
    }

    const emailHtml = `
      <div>
        ${html}
        <p>You can view your document online here:</p>
        <p><a href="${link}" target="_blank">${link}</a></p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Invoicemyte <noreply@invoicemyte.online>",
      to,
      subject,
      html: emailHtml,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, error });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
