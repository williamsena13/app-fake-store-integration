const routes: any = {
  CATALOGO: {
    PRODUCTS: {
      LIST: '/catalogo/products',
      SHOW: '/catalogo/products/:id',
      ACTIVITY: '/catalogo/products/:id/activity',
    },
    CATEGORIES: '/catalogo/categories',
    STATS: '/catalogo/stats',
  },
  INTEGRACOES: {
    FAKESTORE: {
      SYNC: '/integracoes/fakestore/sync',
    },
  },
};

import { getBaseURL } from './environment';
const baseURL = getBaseURL();

const buildRoutes = (baseURL: string, routes: any): any => {
  const buildRoute = (route: string): string => `${baseURL}${route}`;

  const traverseAndBuild = (obj: any): any => {
    const result: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        result[key] = traverseAndBuild(obj[key]);
      } else {
        result[key] = buildRoute(obj[key]);
      }
    }
    return result;
  };

  return traverseAndBuild(routes);
};

export const BackEndRoutes = {
  getHost: getBaseURL,
  routes: buildRoutes(baseURL, routes),
};