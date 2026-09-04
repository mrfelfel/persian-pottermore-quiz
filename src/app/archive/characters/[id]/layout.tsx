import type { Metadata } from 'next';

type Character = {
  id: string;
  name: string;
  aliases: string[];
  role: string;
  school: string;
  period: string;
  epigraph: string;
  content: string;
  metadata: Record<string, string>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/archive/characters`
    );
    const characters: Character[] = await res.json();
    const char = characters.find((c) => c.id === id);

    if (char) {
      return {
        title: char.name,
        description: char.role
          ? `${char.name} — ${char.role}`
          : char.name,
      };
    }
  } catch {
    // ignore fetch errors
  }

  return {
    title: 'شخصیت',
    description: 'شخصیت آرشیو',
  };
}

export default function CharacterIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
