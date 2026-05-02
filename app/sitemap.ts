import type { MetadataRoute } from "next";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";
import { getChapters } from "@/lib/content";

const SITE = "https://pyloft.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toc = getV2Toc();
  const out: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1.0 },
  ];

  for (const entry of toc.chapters) {
    const detail = await getV2Chapter(entry.slug);
    if (!detail) continue;
    out.push({
      url: `${SITE}/learn/v2/${entry.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const lesson of detail.lessons) {
      for (let i = 0; i < lesson.steps.length; i++) {
        out.push({
          url: `${SITE}/learn/v2/${entry.slug}/${lesson.slug}/${i}`,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  for (const c of getChapters()) {
    out.push({
      url: `${SITE}/learn/${c.slug}`,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return out;
}
