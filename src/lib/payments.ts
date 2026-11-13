import "server-only";
import axios from "axios";

const PAYMENT_API_URL = "https://api.payments.example.com/v2";

function paymentClient() {
  const apiKey = process.env.PAYMENT_API_KEY;
  if (!apiKey) throw new Error("Missing env var: PAYMENT_API_KEY");
  return axios.create({
    baseURL: PAYMENT_API_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 10_000,
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export async function createCheckout(invoiceId: string, amountCents: number, email: string) {
  const { data } = await paymentClient().post<CheckoutSession>("/checkout/sessions", {
    reference: invoiceId,
    amount: amountCents,
    currency: "usd",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paid=${invoiceId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  });
  return data;
}

export async function refundPayment(paymentId: string) {
  const { data } = await paymentClient().post(`/payments/${paymentId}/refund`);
  return data;
}
