import { fetchQuery } from "convex/nextjs";
import type { MetadataRoute } from "next";
import { api } from "@/convex/_generated/api";

const baseUrl = "https://reaitycheck.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tests, models] = await Promise.all([
    fetchQuery(api.queries.getActiveTestCases),
    fetchQuery(api.queries.getActiveModels),
  ]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily",
      priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly",
      priority: 0.8 },
    { url: `${baseUrl}/challenges`, lastModified: now,
      changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/benchmark`, lastModified: now,
      changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/providers`, lastModified: now,
      changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/submit-challenge`, lastModified: now,
      changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/submit-challenge/rules`, lastModified: now,
      changeFrequency: "monthly", priority: 0.5 },
  ];

  const challengeRoutes: MetadataRoute.Sitemap = tests.map((test) => ({
    url: `${baseUrl}/challenges/${encodeURIComponent(test.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const providerSlugs = [...new Set(models.map((m) => m.provider))];
  const providerRoutes: MetadataRoute.Sitemap = providerSlugs.map((provider) => ({
    url: `${baseUrl}/providers/${encodeURIComponent(provider)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const modelRoutes: MetadataRoute.Sitemap = models
    .filter((m) => m.slug)
    .map((model) => ({
      url: `${baseUrl}/providers/${encodeURIComponent(model.provider)}/` +
        `${encodeURIComponent(model.slug!)}`,
      lastModified: model.updatedAt ? new Date(model.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...challengeRoutes,
    ...providerRoutes,
    ...modelRoutes,
  ];
}
