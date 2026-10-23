// Offline copy for Pediatric Tools and the Cleanout Planner (home-screen apps).
// Network first: online, every page and file comes fresh from the site (revalidated past the browser
// cache), so a fix reaches phones on the next online load. The saved copy is used only when the network fails.
// Platform rules: MDN, "Using Service Workers", "Cache", "Response.redirect()" (developer.mozilla.org).
// Any ?v= bump, new or renamed page, or new icon: update PRECACHE with the exact URL and bump CACHE (HANDOFF §2).
const CACHE = "peds-tools-v7";
const PRECACHE = [
  "/peds-tools/", "/peds-tools/asm-dosing.html", "/peds-tools/ballard.html", "/peds-tools/febrile-infant.html",
  "/peds-tools/febrile-infant-chop.html", "/peds-tools/kawasaki.html", "/peds-tools/fluids.html",
  "/peds-tools/milestones.html", "/peds-tools/twin-log.html", "/peds-tools/baby-tracker.html", "/peds-tools/validation.html",
  "/peds-tools/credits.html", "/peds-tools/breathing.html", "/peds-tools/breathing-qr.png", "/cleanout-planner/",
  "/peds-tools/shared.js?v=3", "/peds-tools/pets.js?v=5", "/peds-tools/fonts/karmina.css?v=2",
  "/peds-tools/fonts/Karmina-Regular.otf", "/peds-tools/fonts/Karmina-BoldItalic.otf",
  "/peds-tools/favicon.svg", "/peds-tools/apple-touch-icon.png", "/peds-tools/og-image.png",
  "/peds-tools/manifest.webmanifest", "/peds-tools/icon-192.png", "/peds-tools/icon-512.png",
  "/peds-tools/icon-maskable-512.png", "/cleanout-planner/qr-code.png",
  "/cleanout-planner/favicon.svg", "/cleanout-planner/apple-touch-icon.png", "/cleanout-planner/manifest.webmanifest",
  "/cleanout-planner/icon-192.png", "/cleanout-planner/icon-512.png", "/cleanout-planner/icon-maskable-512.png",
  // Vanderbilt ADHD forms: moved to https://adhd-forms.github.io/ (2026-10-23); these two pages only forward there
  "/peds-tools/vanderbilt.html", "/peds-tools/vanderbilt-clinic.html",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(PRECACHE.map(url => new Request(url, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("peds-tools-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  event.respondWith(fromNetwork(req).catch(() => fromCache(req, url)));
});

async function fromNetwork(req) {
  const res = await fetch(req.url, { cache: "no-cache", credentials: "same-origin" });
  // A followed redirect (e.g. /peds-tools → /peds-tools/) can't be handed to a navigation: send the browser there.
  if (res.redirected) return Response.redirect(res.url, 302);
  // Only good same-origin answers replace the saved copy; an error page during a deploy never does.
  if (res.ok && res.type === "basic") {
    const copy = res.clone();
    caches.open(CACHE).then(cache => cache.put(req.url, copy));
  }
  return res;
}

async function fromCache(req, url) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req.url, { ignoreSearch: req.mode === "navigate" });
  if (hit) return hit;
  if (req.mode !== "navigate") throw new Error("offline and not saved");
  const home = url.pathname.startsWith("/cleanout-planner") ? "/cleanout-planner/" : "/peds-tools/";
  return (await cache.match(home)) || Response.error();
}
