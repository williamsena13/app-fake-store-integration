import { ProductFilters } from '@/types';

export const parseFiltersFromUrl = (searchParams: URLSearchParams): ProductFilters => {
  const filters: ProductFilters = {};
  
  const q = searchParams.get('q');
  if (q) filters.q = q;
  
  const category = searchParams.get('category');
  if (category) filters.category = category;
  
  const minPrice = searchParams.get('min_price');
  if (minPrice) filters.min_price = parseFloat(minPrice);
  
  const maxPrice = searchParams.get('max_price');
  if (maxPrice) filters.max_price = parseFloat(maxPrice);
  
  const sort = searchParams.get('sort');
  if (sort === 'price' || sort === 'title') filters.sort = sort;
  
  const order = searchParams.get('order');
  if (order === 'asc' || order === 'desc') filters.order = order;
  
  const page = searchParams.get('page');
  if (page) filters.page = parseInt(page);
  
  const perPage = searchParams.get('per_page');
  if (perPage) filters.per_page = parseInt(perPage);
  
  return filters;
};

export const buildUrlFromFilters = (filters: ProductFilters): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value.toString());
    }
  });
  
  return params.toString();
};