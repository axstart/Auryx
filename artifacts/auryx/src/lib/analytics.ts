const GA_MEASUREMENT_ID = "G-C4NK9NKTF1";
const SESSION_KEY = "auryx_analytics_sid";
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

type GtagFn = (...args: unknown[]) => void;

type PendingGa =
  | { kind: "event"; eventName: string; params: Record<string, unknown> }
  | { kind: "page"; pagePath: string };

let loadPromise: Promise<void> | null = null;
let gaReady = false;
const pendingGa: PendingGa[] = [];

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  return typeof gtag === "function" ? gtag : undefined;
}

function installGtagStub() {
  const w = window as Window & { dataLayer?: unknown[]; gtag?: GtagFn };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    w.dataLayer!.push(arguments);
  };
  return w.gtag;
}

function flushPendingGa() {
  const gtag = getGtag();
  if (!gtag) return;
  while (pendingGa.length) {
    const item = pendingGa.shift()!;
    if (item.kind === "event") {
      gtag("event", item.eventName, item.params);
    } else {
      gtag("config", GA_MEASUREMENT_ID, { page_path: item.pagePath });
    }
  }
}

function sendGaEvent(eventName: string, params: Record<string, unknown>) {
  const gtag = getGtag();
  if (gaReady && gtag) {
    gtag("event", eventName, params);
    return;
  }
  pendingGa.push({ kind: "event", eventName, params });
}

/** Load gtag after window load + idle so it does not contend with LCP. */
export function loadAnalytics(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const inject = () => {
      const finish = () => {
        const gtag = getGtag() ?? installGtagStub();
        gtag("js", new Date());
        // Initial and SPA hits are sent via trackPageView after this resolves.
        gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
        gaReady = true;
        flushPendingGa();
        resolve();
      };

      if (document.querySelector(`script[src="${GTAG_SRC}"]`)) {
        finish();
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = GTAG_SRC;
      script.onload = finish;
      script.onerror = () => resolve();
      document.head.appendChild(script);
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => inject(), { timeout: 2500 });
      } else {
        window.setTimeout(inject, 1);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
  });

  return loadPromise;
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
  const { valueCents, currency, items, productSlug, stepKey, ...rest } = params;
  sendGaEvent(eventName, {
    ...rest,
    ...(stepKey ? { step_key: stepKey } : {}),
    ...(productSlug ? { item_id: productSlug, product_slug: productSlug } : {}),
    ...(typeof valueCents === "number" ? { value: valueCents / 100, currency: currency ?? "USD" } : {}),
    ...(items ? { items } : {}),
    send_to: GA_MEASUREMENT_ID,
  });
  mirrorToBackend(eventName, params);
}

export function trackPageView(pagePath: string) {
  const gtag = getGtag();
  if (gaReady && gtag) {
    gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
    return;
  }
  pendingGa.push({ kind: "page", pagePath });
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
