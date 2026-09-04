import type { Metadata } from 'next';

type ChapterResponse = {
  content: string;
  title: string;
  volume?: string;
  epigraph?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/archive/chapter?slug=${encodeURIComponent(slug)}`
    );
    const chapter: ChapterResponse = await res.json();

    if (chapter && chapter.title) {
      return {
        title: chapter.title,
        description: chapter.epigraph || 'فصل آرشیو تاریخی',
      };
    }
  } catch {
    // ignore fetch errors
  }

  return {
    title: 'فصل',
    description: 'فصل آرشیو تاریخی',
  };
}

export default function ChapterSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
