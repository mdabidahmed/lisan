import { useEffect } from 'react';

import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';

export interface DocumentMeta {
  /** Page title without the brand suffix. Omit on the home page. */
  title?: string | undefined;
  description?: string | undefined;
  /** Overrides the og:type. Defaults to `website`. */
  type?: 'website' | 'article';
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Per-route `<title>` and Open Graph tags. Each vocabulary detail page gets dynamic metadata
 * (product spec §41) without pulling in a head-management dependency.
 */
export function useDocumentMeta({ title, description, type = 'website' }: DocumentMeta): void {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`;
    const resolvedDescription = description ?? APP_DESCRIPTION;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', resolvedDescription);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', resolvedDescription);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', resolvedDescription);
  }, [title, description, type]);
}
