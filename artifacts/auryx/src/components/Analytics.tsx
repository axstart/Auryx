import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";
import { setMeta } from "@/lib/seo";

/** SPA page views. Initial hit comes from the gtag snippet in index.html. */
export default function Analytics() {
  const [location] = useLocation();
  const skipInitial = useRef(true);

  useEffect(() => {
    const token = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;
    if (token) setMeta("google-site-verification", token);
  }, []);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    const pagePath = `${window.location.pathname}${window.location.search}`;
    trackPageView(pagePath);
  }, [location]);

  return null;
}
