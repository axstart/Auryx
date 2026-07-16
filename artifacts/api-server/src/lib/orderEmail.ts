import { sendMail } from "./mailer.js";

type OrderStatus = "pending" | "approved" | "sent_to_pharmacy" | "shipped" | "delivered";

interface OrderEmailData {
  id: number;
  email: string;
  customerName: string;
  status: string;
  trackingNumber?: string | null;
  items: { name: string; quantity: number; variantLabel?: string }[];
}

interface CancelEmailData {
  id: number;
  email: string;
  customerName: string;
  items: { name: string; quantity: number; variantLabel?: string }[];
  reason?: string;
  refunded: boolean;
}

function buildHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
<tr><td align="center" style="padding:48px 20px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr><td style="padding:28px 40px 24px;border-bottom:1px solid #1c1c1c;">
  <p style="margin:0;font-size:16px;letter-spacing:0.25em;color:#C9A844;font-weight:400;">AURYX</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 32px;">
${bodyContent}
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 40px 24px;border-top:1px solid #1c1c1c;">
  <p style="margin:0;font-size:12px;color:#404040;line-height:1.6;">
    \u00a9 Auryx &nbsp;\u00b7&nbsp;
    <a href="https://auryxlife.com" style="color:#C9A844;text-decoration:none;">auryxlife.com</a>
    &nbsp;\u00b7&nbsp;
    <a href="mailto:concierge@auryxlife.com" style="color:#666666;text-decoration:none;">concierge@auryxlife.com</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function p(text: string, style = ""): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#AAAAAA;${style}">${text}</p>`;
}
function h(text: string): string {
  return `<p style="margin:0 0 24px;font-size:22px;color:#EEEEEE;font-weight:400;line-height:1.3;">${text}</p>`;
}
function pill(text: string): string {
  return `<span style="display:inline-block;padding:3px 10px;background:#1e1e1e;border:1px solid #2a2a2a;border-radius:4px;font-size:13px;color:#888888;">${text}</span>`;
}
function gold(text: string): string {
  return `<span style="color:#C9A844;">${text}</span>`;
}
function trackingBlock(tracking: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#151515;border:1px solid #222;border-radius:6px;width:100%;">
<tr><td style="padding:14px 20px;">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;color:#555;text-transform:uppercase;">Tracking Number</p>
  <p style="margin:0;font-size:15px;color:#C9A844;font-family:monospace;">${tracking}</p>
</td></tr></table>`;
}
function orderMeta(id: number, items: OrderEmailData["items"]): string {
  const peptides = items.map(i => i.variantLabel ? `${i.name} (${i.variantLabel})` : i.name).join(", ");
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#151515;border:1px solid #222;border-radius:6px;width:100%;">
<tr><td style="padding:14px 20px;">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;color:#555;text-transform:uppercase;">Order</p>
  <p style="margin:0 0 10px;font-size:15px;color:#CCCCCC;">${gold(`#${id}`)}</p>
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;color:#555;text-transform:uppercase;">Protocol</p>
  <p style="margin:0;font-size:14px;color:#AAAAAA;">${peptides}</p>
</td></tr></table>`;
}
function itemList(items: OrderEmailData["items"]): string {
  const rows = items.map(i => {
    const label = i.variantLabel ? ` (${i.variantLabel})` : "";
    return `<tr><td style="padding:6px 0;border-bottom:1px solid #1c1c1c;"><span style="font-size:14px;color:#AAAAAA;">${i.name}${label}</span></td><td style="padding:6px 0;border-bottom:1px solid #1c1c1c;text-align:right;"><span style="font-size:14px;color:#888888;">\u00d7${i.quantity}</span></td></tr>`;
  }).join("");
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 20px;width:100%;">${rows}</table>`;
}

/* ── Order Approved Email ─────────────────────────────────────────────── */
export function sendOrderApprovedEmail(order: OrderEmailData): void {
  const firstName = order.customerName.split(" ")[0] ?? order.customerName;
  const items = order.items;

  const html = buildHtml([
    h(`Your order has been approved.`),
    orderMeta(order.id, items),
    p(`Hi ${firstName}, your Auryx order has been approved and payment has been successfully processed.`),
    p(`Your order is now being prepared and will ship from a US-licensed compounding pharmacy.`),
    p(`Estimated delivery: <strong style="color:#EEEEEE;">[X] business days</strong> from the date of shipment. We'll send you a tracking number as soon as your order leaves the pharmacy.`),
    p(`If you have any questions, simply reply to this email or contact us at <a href="mailto:concierge@auryxlife.com" style="color:#C9A844;">concierge@auryxlife.com</a>.`),
    p(`We look forward to supporting your journey.`, "color:#666666;font-size:13px;"),
  ].join(""));

  const text = [
    `Hi ${firstName},`,
    ``,
    `Your Auryx order #${order.id} has been approved and payment has been successfully processed.`,
    ``,
    `Items ordered:`,
    ...items.map(i => `  \u2022 ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} \u00d7${i.quantity}`),
    ``,
    `Your order is now being prepared and will ship from a US-licensed compounding pharmacy.`,
    `Estimated delivery: [X] business days from the date of shipment.`,
    ``,
    `If you have any questions, reply to this email or contact us at concierge@auryxlife.com.`,
    ``,
    `\u2014 The Auryx Team | auryxlife.com`,
  ].join("\n");

  sendMail({
    to: order.email,
    subject: `Your Auryx order has been approved \u2014 Order #${order.id}`,
    html,
    text,
  }).catch(() => {});
}

/* ── Order Cancelled Email ────────────────────────────────────────────── */
export function sendOrderCancelledEmail(data: CancelEmailData): void {
  const firstName = data.customerName.split(" ")[0] ?? data.customerName;
  const items = data.items;

  const reasonHtml = data.reason
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#AAAAAA;"><strong style="color:#EEEEEE;">Reason for cancellation:</strong> ${data.reason.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
    : p(`If you have questions about this decision, please contact our team at <a href="mailto:concierge@auryxlife.com" style="color:#C9A844;">concierge@auryxlife.com</a>.`);

  const reasonText = data.reason
    ? `Reason for cancellation: ${data.reason}`
    : `If you have questions about this decision, please contact our team at concierge@auryxlife.com.`;

  const refundHtml = data.refunded
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#AAAAAA;">A full refund has been issued to your original payment method. Please allow <strong style="color:#EEEEEE;">5\u201310 business days</strong> for the refund to appear on your statement.</p>`
    : "";

  const refundText = data.refunded
    ? `A full refund has been issued to your original payment method. Please allow 5\u201310 business days for the refund to appear on your statement.`
    : "";

  const html = buildHtml([
    h(`Update on your order.`),
    orderMeta(data.id, items),
    p(`Hi ${firstName}, your order was reviewed by our clinical team and unfortunately could not be fulfilled at this time.`),
    reasonHtml,
    refundHtml,
    p(`We appreciate your interest in Auryx and hope to serve you in the future.`, "color:#666666;font-size:13px;"),
  ].join(""));

  const textLines = [
    `Hi ${firstName},`,
    ``,
    `Your Auryx order #${data.id} was reviewed by our clinical team and unfortunately could not be fulfilled at this time.`,
    ``,
    reasonText,
    ...(data.refunded ? [``, refundText] : []),
    ``,
    `\u2014 The Auryx Team | auryxlife.com`,
  ];

  sendMail({
    to: data.email,
    subject: `Update on your Auryx order \u2014 Order #${data.id}`,
    html,
    text: textLines.join("\n"),
  }).catch(() => {});
}

/* ── Legacy status emails (shipped, delivered, etc.) ────────────────────── */
export function sendOrderStatusEmail(order: OrderEmailData): void {
  const firstName = order.customerName.split(" ")[0] ?? order.customerName;
  const items = order.items as OrderEmailData["items"];

  const templates: Partial<Record<OrderStatus, { subject: string; html: string; text: string }>> = {
    approved: {
      subject: `Order #${order.id} Approved \u2014 Auryx`,
      html: buildHtml([
        h(`Your order has been approved.`),
        orderMeta(order.id, items),
        p(`Hi ${firstName}, your Auryx order has been approved and is being prepared for fulfillment.`),
        p(`We'll send you another update as soon as your order is sent to the pharmacy.`),
      ].join("")),
      text: [
        `Hi ${firstName},`,
        ``,
        `Your Auryx order #${order.id} has been approved and is being prepared for fulfillment.`,
        ``,
        `We'll send another update when your order is sent to the pharmacy.`,
        ``,
        `\u2014 The Auryx Team | auryxlife.com`,
      ].join("\n"),
    },
    sent_to_pharmacy: {
      subject: `Order #${order.id} \u2014 Sent to Pharmacy`,
      html: buildHtml([
        h(`Your order is at the pharmacy.`),
        orderMeta(order.id, items),
        p(`Hi ${firstName}, your Auryx order has been sent to our compounding pharmacy partner for preparation.`),
        p(`Compounding typically takes 3\u20137 business days. You'll receive a tracking number as soon as it ships.`),
      ].join("")),
      text: [
        `Hi ${firstName},`,
        ``,
        `Your Auryx order #${order.id} has been sent to our compounding pharmacy for preparation.`,
        ``,
        `You'll receive a tracking number as soon as it ships.`,
        ``,
        `\u2014 The Auryx Team | auryxlife.com`,
      ].join("\n"),
    },
    shipped: {
      subject: `Order #${order.id} Has Shipped \u2014 Auryx`,
      html: buildHtml([
        h(`Your order is on its way.`),
        orderMeta(order.id, items),
        ...(order.trackingNumber ? [trackingBlock(order.trackingNumber)] : []),
        p(`Hi ${firstName}, great news \u2014 your Auryx order has shipped and is on its way to you.`),
        p(`${order.trackingNumber ? "Use the tracking number above to follow your shipment." : "Tracking information will be available shortly."}`),
        p(`If you have any questions about your protocol, reply to this email or contact us at <a href="mailto:concierge@auryxlife.com" style="color:#C9A844;">concierge@auryxlife.com</a>.`),
      ].join("")),
      text: [
        `Hi ${firstName},`,
        ``,
        `Your Auryx order #${order.id} has shipped!`,
        ``,
        ...(order.trackingNumber ? [`Tracking number: ${order.trackingNumber}`, ``] : []),
        `\u2014 The Auryx Team | auryxlife.com`,
      ].join("\n"),
    },
    delivered: {
      subject: `Order #${order.id} Delivered \u2014 Welcome to Your Protocol`,
      html: buildHtml([
        h(`Your order has arrived.`),
        orderMeta(order.id, items),
        p(`Hi ${firstName}, your Auryx order has been delivered. Welcome to your protocol.`),
        p(`If you have questions about dosing, administration, or anything else, our clinical team is here. Simply reply to this email.`),
        p(`We look forward to supporting your journey.`, "color:#666666;font-size:13px;"),
      ].join("")),
      text: [
        `Hi ${firstName},`,
        ``,
        `Your Auryx order #${order.id} has been delivered. Welcome to your protocol.`,
        ``,
        `Reply to this email if you have any questions.`,
        ``,
        `\u2014 The Auryx Team | auryxlife.com`,
      ].join("\n"),
    },
  };

  const tpl = templates[order.status as OrderStatus];
  if (!tpl) return;

  sendMail({
    to: order.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  }).catch(() => {});
}
