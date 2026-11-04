import Layout from './components/Layout';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Templates from './pages/Templates';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';
import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import Home from './pages/Home';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/templates',
        element: <Templates />
      },
      {
        path: '/category/:categorySlug',
        element: <CategoryPage />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/privacy',
        element: <Privacy />
      },
      {
        path: '/terms',
        element: <Terms />
      },
      {
        path: '/:slug',
        element: <ToolPage />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
