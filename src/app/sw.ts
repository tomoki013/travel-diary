import {
  Serwist,
  CacheFirst,
  ExpirationPlugin,
  type RuntimeCaching,
  type PrecacheEntry,
  type SerwistGlobalConfig,
} from "serwist";
import { defaultCache } from "@serwist/next/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const ARTICLE_DOCUMENT_PATHS = [/^\/posts\/[^/]+\/?$/, /^\/preview\/[^/]+\/?$/];

const cacheStrategies: RuntimeCaching[] = [
  {
    matcher: ({ request, url, sameOrigin }) => {
      if (!sameOrigin || request.destination !== "document") {
        return false;
      }

      if (url.pathname.startsWith("/api/")) {
        return false;
      }

      return ARTICLE_DOCUMENT_PATHS.some((pattern) => pattern.test(url.pathname));
    },
    handler: new CacheFirst({
      cacheName: "article-documents",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 14 * 24 * 60 * 60,
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...cacheStrategies, ...defaultCache],

  // オプション
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
