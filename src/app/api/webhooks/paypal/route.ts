import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const json = await req.json();
  console.log("Received webhook:", json);
  return new Response("Webhook received", { status: 200 });
}
