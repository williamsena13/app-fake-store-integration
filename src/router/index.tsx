import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage';
import ProductsListPage from '../pages/ProductsListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoriesPage from '../pages/CategoriesPage';
import StatsPage from '../pages/StatsPage';
import SyncPage from '../pages/SyncPage';
import { FrontEndRoutes } from '../config/front-end-routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={FrontEndRoutes.HOME} replace />
      },
      {
        path: FrontEndRoutes.HOME,
        element: <HomePage />
      },
      {
        path: FrontEndRoutes.PRODUCTS.LIST,
        element: <ProductsListPage />
      },
      {
        path: FrontEndRoutes.PRODUCTS.DETAIL,
        element: <ProductDetailPage />
      },
      {
        path: FrontEndRoutes.CATEGORIES,
        element: <CategoriesPage />
      },
      {
        path: FrontEndRoutes.STATS,
        element: <StatsPage />
      },
      {
        path: FrontEndRoutes.SYNC,
        element: <SyncPage />
      },
      {
        path: '*',
        element: <Navigate to={FrontEndRoutes.HOME} replace />
      }
    ]
  }
]);