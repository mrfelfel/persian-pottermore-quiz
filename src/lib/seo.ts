import type { Metadata } from 'next';

const SITE_URL = 'https://vezaratjadoo.vercel.app';
const SITE_NAME = 'وزارت سحر و جادو';
const SITE_DESCRIPTION = 'جامعه جادوگری فارسی — وزارت سحر و جادوی ایران | کوییز گروه‌بندی هاگوارتز، آرشیو تاریخی، بانک گرینگوتس و کلاس‌های جادویی';

export function baseUrl(path: string = ''): string {
  return `${SITE_URL}${path}`;
}

export function baseMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: ['هاگوارتز', 'وزارت سحر و جادو', 'جادوگری', 'کوییز', 'آرشیو', 'فارسی', 'تلگرام'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: baseUrl('/og-image.png'),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [baseUrl('/og-image.png')],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
    ...overrides,
  };
}

export function pageMetadata(
  path: string,
  title: string,
  description: string,
  extra: Partial<Metadata> = {}
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: baseUrl(path),
      images: [
        {
          url: baseUrl('/og-image.png'),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: baseUrl(path),
    },
    ...extra,
  };
}

// JSON-LD helpers
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: 'fa',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/archive?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: baseUrl(opts.datePublished),
    datePublished: opts.datePublished || new Date().toISOString(),
    dateModified: opts.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: baseUrl('/og-image.png'),
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function characterJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  jobTitle?: string;
  affiliation?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    description: opts.description,
    url: baseUrl(opts.path),
    jobTitle: opts.jobTitle || undefined,
    affiliation: opts.affiliation
      ? { '@type': 'Organization', name: opts.affiliation }
      : undefined,
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
