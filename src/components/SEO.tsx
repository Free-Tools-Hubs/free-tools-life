import React from 'react';
import { BASE_URL } from '../utils/indexabilityPolicy';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
}

export function formatPageTitle(title: string): string {
  if (title.includes('| LifeHub') || title.startsWith('LifeHub |')) {
    return title;
  }
  return `${title} | LifeHub`;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = `${BASE_URL}/og-image.png`
}) => {
  React.useEffect(() => {
    const fullTitle = formatPageTitle(title);
    document.title = fullTitle;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      const selector = `meta[${attr}="${key}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);

    const resolvedUrl =
      canonical ||
      (typeof window !== 'undefined'
        ? `${BASE_URL}${window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/+$/, '')}`
        : `${BASE_URL}/`);

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', resolvedUrl);
    setMetaTag('property', 'og:image', ogImage);

    setMetaTag(' name'.trim() as 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:url', resolvedUrl);
    setMetaTag('name', 'twitter:image', ogImage);

    let link = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    } else if (link) {
      link.remove();
    }
  }, [title, description, canonical, robots, ogType, ogImage]);

  return null;
};

export const JSONLD: React.FC<{ data: object }> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default SEO;
