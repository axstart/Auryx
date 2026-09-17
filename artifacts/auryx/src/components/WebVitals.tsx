import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import { trackEvent } from "@/lib/analytics";

function report(metric: Metric) {
  trackEvent("web_vitals", {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_navigation_type: metric.navigationType,
  });
}

/** Reports Core Web Vitals to GA4 + funnel_events. */
export default function WebVitals() {
  useEffect(() => {
    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  }, []);
  return null;
}
