import { useState, useEffect } from 'react';

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

// Memory cache for the templates to avoid double fetching
let cachedTemplates: LifeTemplate[] | null = null;
let fetchPromise: Promise<LifeTemplate[]> | null = null;

export const useTemplates = () => {
  const [templates, setTemplates] = useState<LifeTemplate[]>(cachedTemplates || []);
  const [loading, setLoading] = useState(!cachedTemplates);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedTemplates) {
      setLoading(false);
      return;
    }

    if (fetchPromise) {
      fetchPromise.then(data => {
        setTemplates(data);
        setLoading(false);
      });
      return;
    }

    fetchPromise = fetch('/lifeTemplates.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load templates');
        return res.json();
      })
      .then(data => {
        cachedTemplates = data;
        setTemplates(data);
        setLoading(false);
        return data;
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        return [];
      });
  }, []);

  return { templates, loading, error };
};
