import { validateInquiry, type InquiryResponse } from "@/lib/inquiry";
import { deliverInquiry } from "@/lib/inquiry-delivery";

const respond = (body: InquiryResponse, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next can use its internal bind address in request.url. Compare against the
  // incoming Host so same-origin requests also work behind the local server.
  const host = request.headers.get("host") ?? new URL(request.url).host;
  let sameOrigin = true;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      sameOrigin =
        ["http:", "https:"].includes(originUrl.protocol) &&
        originUrl.host === host;
    } catch {
      sameOrigin = false;
    }
  }
  if (!sameOrigin)
    return respond(
      {
        status: "error",
        message: "Please submit from the Ayeb Creative website.",
      },
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return respond(
      { status: "error", message: "Please send a valid inquiry." },
      415,
    );
  let input: unknown;
  try {
    // Bound the body even when no Content-Length header is supplied.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24_000) {
        await reader.cancel();
        return respond(
          {
            status: "error",
            message:
              "Your inquiry is too long. Please shorten it and try again.",
          },
          413,
        );
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return respond(
      { status: "error", message: "Please send a valid inquiry." },
      400,
    );
  }
  const { values, errors } = validateInquiry(input);
  if (Object.keys(errors).length)
    return respond(
      {
        status: "error",
        message: "Please check the highlighted fields.",
        errors,
      },
      422,
    );
  try {
    const status = await deliverInquiry(values);
    return respond({ status });
  } catch {
    // No inquiry content or provider credentials are logged or returned.
    return respond(
      {
        status: "error",
        message:
          "We couldn’t confirm receipt of your inquiry. Your details are still here. Please try again or email us directly.",
      },
      502,
    );
  }
}
