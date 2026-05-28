import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vemo-technology.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/fr",
    "/en",
    "/fr/commencer",
    "/en/start",
    "/fr/tarifs",
    "/en/pricing",
    "/fr/faq",
    "/en/faq",
    "/fr/contact",
    "/en/contact",
    "/fr/conditions",
    "/en/terms",
    "/fr/confidentialite",
    "/en/privacy",
    "/fr/remboursement",
    "/en/refund-policy",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/fr" || route === "/en" ? "weekly" : "monthly",
    priority: route === "" || route === "/fr" || route === "/en" ? 1 : 0.7,
  }));
}


