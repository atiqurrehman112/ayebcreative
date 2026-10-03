import type { Inquiry } from "./inquiry";

// Server-only adapter. Keep credentials here, never in the client form.
// A configured endpoint must acknowledge actual acceptance with { received: true }.
export async function deliverInquiry(
  inquiry: Inquiry,
): Promise<"received" | "draft"> {
  const endpoint = process.env.INQUIRY_ENDPOINT;
  if (!endpoint) return "draft";
  const url = new URL(endpoint);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("Invalid inquiry endpoint");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(process.env.INQUIRY_API_KEY
        ? { Authorization: `Bearer ${process.env.INQUIRY_API_KEY}` }
        : {}),
    },
    body: JSON.stringify(inquiry),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Inquiry was not acknowledged");
  const acknowledgment: unknown = await response.json();
  if (
    !acknowledgment ||
    typeof acknowledgment !== "object" ||
    !("received" in acknowledgment) ||
    acknowledgment.received !== true
  )
    throw new Error("Missing inquiry acknowledgment");
  return "received";
}
