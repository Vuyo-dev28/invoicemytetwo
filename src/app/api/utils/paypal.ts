export async function paypalRequest(path: string, method = "POST", body?: any) {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_SECRET
      ? `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      : ""
  ).toString("base64");

  const res = await fetch(`${process.env.PAYPAL_API_URL}${path}`, {
    method,
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    console.log(await res.text());
    throw new Error("PayPal API Error");
  }

  return await res.json();
}
