// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getJobOpenings } from '@/app/lib/db/jobs';

const BASE_URL = 'https://www.tekkistudio.com';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/a-propos', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/diagnostic', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/cas-clients', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/cas-clients/abarings', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/cas-clients/momo-le-bottier', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/cas-clients/6c-no-filter', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/cas-clients/ahovi-cosmetics', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/cas-clients/racines-precieuses', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/nos-marques', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/nos-marques/viens-on-sconnait', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/nos-marques/amani', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/equipe', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/careers', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/careers/spontaneous', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/mentions-legales', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/politique-confidentialite', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/cgv', changeFrequency: 'yearly', priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let jobEntries: MetadataRoute.Sitemap = [];
  try {
    const jobs = await getJobOpenings({ isActive: true });
    jobEntries = jobs.map((job) => ({
      url: `${BASE_URL}/careers/${job.slug}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: 'weekly',
      priority: 0.4,
    }));
  } catch {
    // Le sitemap ne doit pas échouer si la base de données est momentanément indisponible.
  }

  return [...staticEntries, ...jobEntries];
}
