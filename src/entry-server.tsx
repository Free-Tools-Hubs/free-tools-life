import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './App';
import { InitialRoutePayload } from './hooks/useTemplates';

// Avoid React SSR useLayoutEffect noisy warning from React Router's Link/RouterProvider on Node
React.useLayoutEffect = React.useEffect;

export {
  BASE_URL,
  CATEGORIES,
  CATEGORY_BY_NAME,
  CATEGORY_BY_SLUG,
  classifyTemplateRecord,
  parseTemplateTitle
} from './utils/indexabilityPolicy';
export { getDeterministicContent } from './utils/deterministicVariationEngine';
export { formatPageTitle } from './components/SEO';

export function renderRoute(url: string, payload?: InitialRoutePayload): string {
  globalThis.__PRERENDER_PAYLOAD__ = payload;
  try {
    const router = createMemoryRouter(routes, {
      initialEntries: [url]
    });
    return renderToString(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  } finally {
    globalThis.__PRERENDER_PAYLOAD__ = undefined;
  }
}

