import { useEffect } from "react";
import { useLocation } from "wouter";
import { loadAnalytics, trackPageView } from "@/lib/analytics";
import { setMeta } from "@/lib/seo";

/** SPA page views. gtag.js is injected after load/idle — not in <head>. */
export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    const token = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;
    if (token) setMeta("google-site-verification", token);
  }, []);

  useEffect(() => {
    const pagePath = `${window.location.pathname}${window.location.search}`;
    void loadAnalytics().then(() => {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== pagePath) return;
      trackPageView(pagePath);
    });
  }, [location]);

  return null;
}
