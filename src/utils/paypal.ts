
export const dynamic = "force-dynamic";

export async function getPayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
    const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${base64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await res.json();
    return data.access_token;
  }