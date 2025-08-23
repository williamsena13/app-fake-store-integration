export interface Category {
  id: number;
  name: string;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: {
    data: Product[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface Stats {
  total_products: number;
  avg_price: number;
  by_category: Array<{
    category: string;
    total: number;
  }>;
  top5_expensive: Array<{
    id: number;
    title: string;
    price: string;
    image_url: string;
    category_name: string;
    description: string;
  }>;
}

export interface SyncResponse {
  success: boolean;
  mode: 'full' | 'delta' | 'limited';
  limit?: number;
  result: {
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{
      message: string;
      context: {
        product_id: number;
      };
    }>;
    imported_products?: Array<{
      id: number;
      title: string;
      external_id: number;
      price?: string;
      category_name?: string;
    }>;
    updated_products?: Array<{
      id: number;
      title: string;
      external_id: number;
      price?: string;
      category_name?: string;
    }>;
    skipped_products?: Array<{
      id: number;
      title: string;
      external_id: number;
      reason: string;
      price?: string;
      category_name?: string;
    }>;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    status: number;
    context: Record<string, any>;
    request_id: string;
  };
}

export interface ProductFilters {
  q?: string;
  category?: string;
  categories?: string[];
  min_price?: number;
  max_price?: number;
  sort?: 'price' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CategoriesResponse {
  data: Category[];
}