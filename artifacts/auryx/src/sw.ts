/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope & {
  readonly __WB_MANIFEST: Array<
    string | { integrity?: string; revision: string | null; url: string }
  >;
};

const OFFLINE_URL = new URL("offline.html", self.registration.scope).href;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();
self.skipWaiting();

// Navigations stay network-first so HTML deploys go live. Hashed /assets/*
// are not handled here — they rely on Vercel Cache-Control: immutable.
registerRoute(
  new NavigationRoute(
    async ({ request }) => {
      try {
        return await fetch(request);
      } catch {
        return (
          (await matchPrecache(OFFLINE_URL)) ??
          new Response("Auryx is currently offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      }
    },
    {
      denylist: [
        /\/api(?:\/|$)/i,
        /\/assets\//i,
        /\/sw\.js(?:$|\?)/i,
        /\/registerSW\.js(?:$|\?)/i,
        /\/manifest\.webmanifest(?:$|\?)/i,
        /\.(?:js|css|mjs|map|png|jpe?g|webp|svg|gif|ico|woff2?|txt|xml|webmanifest)$/i,
      ],
    },
  ),
);
