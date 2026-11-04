import { useState, useEffect, useCallback } from 'react';

export interface LifeTemplate {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  baseRoutines: string[];
  baseHabits: string[];
  baseGoals: string[];
  checklistTemplates: string[];
  plannerFrameworks: string;
}

export interface InitialRoutePayload {
  routeType?: 'home' | 'category' | 'template' | 'templates-dir' | 'other';
  currentTemplate?: LifeTemplate | null;
  relatedTemplates?: LifeTemplate[];
  templates?: LifeTemplate[];
  categoryCounts?: Record<string, number>;
  totalTier1Count?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __PRERENDER_PAYLOAD__: InitialRoutePayload | undefined;
  interface Window {
    __INITIAL_DATA__?: InitialRoutePayload;
  }
}

let cachedTier1Templates: LifeTemplate[] | null = null;
let cachedFullTemplates: LifeTemplate[] | null = null;
let tier1FetchPromise: Promise<LifeTemplate[]> | null = null;
let fullFetchPromise: Promise<LifeTemplate[]> | null = null;

export function getInitialPayload(): InitialRoutePayload | null {
  if (typeof globalThis !== 'undefined' && globalThis.__PRERENDER_PAYLOAD__) {
    return globalThis.__PRERENDER_PAYLOAD__;
  }
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_DATA__) {
      return window.__INITIAL_DATA__;
    }
    const el = document.getElementById('__INITIAL_DATA__');
    if (el && el.textContent) {
      try {
        const parsed = JSON.parse(el.textContent) as InitialRoutePayload;
        window.__INITIAL_DATA__ = parsed;
        return parsed;
      } catch {
        // Ignore malformed JSON
      }
    }
  }
  return null;
}

function getSeededTemplates(slug?: string): { list: LifeTemplate[]; hasTarget: boolean } {
  if (cachedFullTemplates) {
    return {
      list: cachedFullTemplates,
      hasTarget: slug ? cachedFullTemplates.some(t => t.slug === slug) : true
    };
  }
  if (cachedTier1Templates) {
    const has = slug ? cachedTier1Templates.some(t => t.slug === slug) : true;
    if (has) {
      return { list: cachedTier1Templates, hasTarget: true };
    }
  }

  const payload = getInitialPayload();
  if (payload) {
    const combinedMap = new Map<string, LifeTemplate>();
    if (payload.currentTemplate) {
      combinedMap.set(payload.currentTemplate.slug, payload.currentTemplate);
    }
    if (payload.relatedTemplates) {
      for (const t of payload.relatedTemplates) {
        combinedMap.set(t.slug, t);
      }
    }
    if (payload.templates) {
      for (const t of payload.templates) {
        combinedMap.set(t.slug, t);
      }
    }
    const combined = Array.from(combinedMap.values());
    if (slug) {
      if (combinedMap.has(slug)) {
        return { list: combined, hasTarget: true };
      }
    } else if (combined.length > 0) {
      return { list: combined, hasTarget: true };
    }
  }

  return { list: cachedTier1Templates || [], hasTarget: false };
}

export const useTemplates = (options?: { requiredSlug?: string; requireFullArchive?: boolean }) => {
  const requiredSlug = options?.requiredSlug;
  const requireFullArchive = options?.requireFullArchive || false;

  const initial = getSeededTemplates(requiredSlug);
  const [templates, setTemplates] = useState<LifeTemplate[]>(initial.list);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof globalThis !== 'undefined' && globalThis.__PRERENDER_PAYLOAD__) {
      return false;
    }
    if (requireFullArchive) {
      return !cachedFullTemplates;
    }
    return !initial.hasTarget;
  });
  const [error, setError] = useState<string | null>(null);
  const [isFullArchiveLoaded, setIsFullArchiveLoaded] = useState<boolean>(Boolean(cachedFullTemplates));

  const loadFullArchive = useCallback(async (): Promise<LifeTemplate[]> => {
    if (cachedFullTemplates) {
      setTemplates(cachedFullTemplates);
      setIsFullArchiveLoaded(true);
      setLoading(false);
      return cachedFullTemplates;
    }
    setLoading(true);
    if (!fullFetchPromise) {
      fullFetchPromise = fetch('/lifeTemplates.json')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load full template library');
          return res.json();
        })
        .then((data: LifeTemplate[]) => {
          cachedFullTemplates = data;
          return data;
        });
    }
    try {
      const data = await fullFetchPromise;
      setTemplates(data);
      setIsFullArchiveLoaded(true);
      setLoading(false);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load templates';
      setError(message);
      setLoading(false);
      return [];
    }
  }, []);

  useEffect(() => {
    if (requireFullArchive) {
      loadFullArchive();
      return;
    }

    const seeded = getSeededTemplates(requiredSlug);
    if (seeded.hasTarget && seeded.list.length > 0) {
      setTemplates(seeded.list);
      setLoading(false);
      // If on /templates directory and only a small subset is seeded, load tier1Templates.json in background
      if (!requiredSlug && !cachedTier1Templates && !cachedFullTemplates && seeded.list.length < 50) {
        if (!tier1FetchPromise) {
          tier1FetchPromise = fetch('/tier1Templates.json')
            .then(res => (res.ok ? res.json() : fetch('/lifeTemplates.json').then(r => r.json())))
            .then((data: LifeTemplate[]) => {
              cachedTier1Templates = data;
              return data;
            })
            .catch(() => seeded.list);
        }
        tier1FetchPromise.then(data => {
          if (data && data.length > seeded.list.length) {
            setTemplates(data);
          }
        });
      }
      return;
    }

    // Need to load Tier 1 templates first, and if requiredSlug is not in Tier 1, load full archive
    setLoading(true);
    if (!tier1FetchPromise) {
      tier1FetchPromise = fetch('/tier1Templates.json')
        .then(res => {
          if (!res.ok) throw new Error('Fallback to full archive');
          return res.json();
        })
        .then((data: LifeTemplate[]) => {
          cachedTier1Templates = data;
          return data;
        })
        .catch(() => loadFullArchive());
    }

    tier1FetchPromise
      .then(async (tier1Data) => {
        if (requiredSlug && !tier1Data.some(t => t.slug === requiredSlug)) {
          await loadFullArchive();
        } else {
          setTemplates(tier1Data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load templates';
        setError(message);
        setLoading(false);
      });
  }, [requiredSlug, requireFullArchive, loadFullArchive]);

  return {
    templates,
    loading,
    error,
    isFullArchiveLoaded,
    loadFullArchive
  };
};
