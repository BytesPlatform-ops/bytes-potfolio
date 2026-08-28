import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = Record<string, string | undefined>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(data: Payload) {
  return Object.entries(data)
    .filter(([, v]) => v && String(v).trim().length > 0)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(
          k,
        )}</td><td style="padding:6px 0">${escapeHtml(String(v)).replace(
          /\n/g,
          "<br>",
        )}</td></tr>`,
    )
    .join("");
}

export async function POST(request: Request) {
  let body: { kind?: string; data?: Payload };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body.data ?? {};
  const kind = body.kind === "review" ? "Website review" : "Project enquiry";

  // --- server-side validation (the client validates too) -------------------
  const email = (data.email ?? "").trim();
  const name = (data.name ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  // No credentials configured, or no recipient. Say so honestly rather than
  // faking success. The recipient is server-side only and has no default: an
  // address compiled into the client bundle is a published address.
  if (!apiKey || !from || !to) {
    return NextResponse.json(
      {
        delivered: false,
        reason: "not-configured",
        error:
          "Email delivery is not configured on this deployment. Set RESEND_API_KEY, ENQUIRY_FROM_EMAIL and ENQUIRY_TO_EMAIL to enable it.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `${kind} — ${name}`,
        html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;color:#111">
          <h2 style="font-size:16px;margin:0 0 14px">${escapeHtml(kind)}</h2>
          <table style="border-collapse:collapse">${rows(data)}</table>
        </div>`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend rejected the enquiry:", res.status, detail);
      return NextResponse.json(
        { delivered: false, error: "The email provider rejected the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ delivered: true });
  } catch (err) {
    console.error("Enquiry send failed:", err);
    return NextResponse.json(
      { delivered: false, error: "Could not reach the email provider." },
      { status: 502 },
    );
  }
}
