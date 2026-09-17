const GA_MEASUREMENT_ID = "G-C4NK9NKTF1";
const SESSION_KEY = "auryx_analytics_sid";

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  return typeof gtag === "function" ? gtag : undefined;
}

export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export type TrackParams = {
  stepKey?: string;
  productSlug?: string;
  valueCents?: number;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
  }>;
  [key: string]: unknown;
};

function mirrorToBackend(eventName: string, params: TrackParams) {
  const sessionId = getAnalyticsSessionId();
  const body = {
    sessionId,
    eventName,
    stepKey: typeof params.stepKey === "string" ? params.stepKey : undefined,
    productSlug: typeof params.productSlug === "string" ? params.productSlug : undefined,
    valueCents: typeof params.valueCents === "number" ? params.valueCents : undefined,
    meta: {
      ...params,
      stepKey: undefined,
      productSlug: undefined,
      valueCents: undefined,
    },
  };

  try {
    const payload = JSON.stringify(body);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/funnel-events", blob);
      return;
    }
    void fetch("/api/funnel-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // telemetry must never break UX
  }
}

/** Fire GA4 event + mirror to Postgres funnel_events. */
export function trackEvent(eventName: string, params: TrackParams = {}) {
  const gtag = getGtag();
  if (gtag) {
    const { valueCents, currency, items, productSlug, stepKey, ...rest } = params;
    gtag("event", eventName, {
      ...rest,
      ...(stepKey ? { step_key: stepKey } : {}),
      ...(productSlug ? { item_id: productSlug, product_slug: productSlug } : {}),
      ...(typeof valueCents === "number" ? { value: valueCents / 100, currency: currency ?? "USD" } : {}),
      ...(items ? { items } : {}),
      send_to: GA_MEASUREMENT_ID,
    });
  }
  mirrorToBackend(eventName, params);
}

export function trackPageView(pagePath: string) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
}

export function trackViewItem(product: {
  slug: string;
  name: string;
  priceCents: number;
  category?: string;
}) {
  trackEvent("view_item", {
    productSlug: product.slug,
    valueCents: product.priceCents,
    currency: "USD",
    items: [
      {
        item_id: product.slug,
        item_name: product.name,
        price: product.priceCents / 100,
        quantity: 1,
      },
    ],
    item_category: product.category,
  });
}

export function trackAddToCart(product: {
  slug: string;
  name: string;
  priceCents: number;
  quantity?: number;
}) {
  const qty = product.quantity ?? 1;
  trackEvent("add_to_cart", {
    productSlug: product.slug,
    valueCents: product.priceCents * qty,
    currency: "USD",
    items: [
      {
        item_id: product.slug,
        item_name: product.name,
        price: product.priceCents / 100,
        quantity: qty,
      },
    ],
  });
}

export function trackBeginCheckout(totalCents: number, itemCount: number) {
  trackEvent("begin_checkout", {
    valueCents: totalCents,
    currency: "USD",
    item_count: itemCount,
  });
}

export function trackPurchase(orderId: string, totalCents: number) {
  trackEvent("purchase", {
    valueCents: totalCents,
    currency: "USD",
    transaction_id: orderId,
  });
}

export { GA_MEASUREMENT_ID };
