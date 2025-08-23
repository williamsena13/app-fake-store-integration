import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { Product, ProductsResponse, Stats, SyncResponse, ProductFilters, Category } from '@/types';
import { BackEndRoutes } from '../config/back-end-routes';
import toast from 'react-hot-toast';

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const STALE_TIME_10_MIN = 10 * 60 * 1000;

export const useProductsQuery = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`${BackEndRoutes.routes.CATALOGO.PRODUCTS.LIST}?${params}`);
      return response.data;
    },
    staleTime: STALE_TIME_5_MIN,
  });
};

export const useProductQuery = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const response = await apiClient.get(BackEndRoutes.routes.CATALOGO.PRODUCTS.SHOW.replace(':id', id.toString()));
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useProductsByCategoryQuery = (category: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get(`${BackEndRoutes.routes.CATALOGO.PRODUCTS.LIST}?category=${encodeURIComponent(category)}&per_page=100`);
      return response.data.data;
    },
    enabled: enabled && !!category,
    staleTime: STALE_TIME_5_MIN,
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await apiClient.get(BackEndRoutes.routes.CATALOGO.CATEGORIES);
      return response.data.data;
    },
    staleTime: STALE_TIME_10_MIN,
  });
};
export const useStatsQuery = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stats> => {
      const response = await apiClient.get(BackEndRoutes.routes.CATALOGO.STATS);
      return response.data.data;
    },
    staleTime: STALE_TIME_10_MIN,
  });
};

// Hook para buscar produtos mais baratos
export const useCheapestProductsQuery = () => {
  return useQuery({
    queryKey: ['products', 'cheapest'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get(`${BackEndRoutes.routes.CATALOGO.PRODUCTS.LIST}?sort=price&order=asc&per_page=5`);
      return response.data.data.data;
    },
    staleTime: STALE_TIME_10_MIN,
  });
};

export const useSyncMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ mode, limit }: { mode: 'full' | 'delta' | 'limited'; limit?: number }): Promise<SyncResponse> => {
      const params = new URLSearchParams({ mode });
      if (limit && mode === 'limited') {
        params.append('limit', limit.toString());
      }
      const response = await apiClient.post(`${BackEndRoutes.routes.INTEGRACOES.FAKESTORE.SYNC}?${params}`);
      return response.data;
    },
    onSuccess: (data: SyncResponse) => {
      const { result } = data;
      toast.success(`Sincronização ${data.mode} concluída! ${result.imported} importados, ${result.updated} atualizados`);
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => {
      toast.error('Erro na sincronização');
    },
  });
};