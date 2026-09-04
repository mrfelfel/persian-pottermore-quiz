import type { Metadata } from 'next';

type Volume = {
  id: string;
  title: string;
  slug: string;
  icon: string;
  chapters: { slug: string; title: string; epigraph?: string; size: number }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/archive/catalog`
    );
    const volumes: Volume[] = await res.json();
    const vol = volumes.find((v) => v.slug === slug);

    if (vol) {
      return {
        title: vol.title,
        description: `${vol.title} — ${vol.chapters.length} فصل`,
      };
    }
  } catch {
    // ignore fetch errors
  }

  return {
    title: 'جلد',
    description: 'جلد آرشیو',
  };
}

export default function VolumeSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
