import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const GA_MEASUREMENT_ID = "G-C4NK9NKTF1";

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  return typeof gtag === "function" ? gtag : undefined;
}

/** SPA page views. Initial hit comes from the gtag snippet in index.html. */
export default function Analytics() {
  const [location] = useLocation();
  const skipInitial = useRef(true);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    const gtag = getGtag();
    if (!gtag) return;

    const pagePath = `${window.location.pathname}${window.location.search}`;
    gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
  }, [location]);

  return null;
}
