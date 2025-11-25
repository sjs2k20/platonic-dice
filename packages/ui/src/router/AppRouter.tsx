import { Routes, Route } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { routes } from '@config/routes';
import { NotFound } from '@pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((route) => {
          const Component = route.component;
          return (
            <Route
              key={route.path}
              path={route.path === '/' ? undefined : route.path.slice(1)}
              index={route.path === '/'}
              element={<Component />}
            />
          );
        })}
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
