import React, { useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { useProductsQuery } from '../api/products';
import { ProductFilters as IProductFilters } from '../types';
import ProductFiltersModal from '../components/Filters/ProductFiltersModal';
import ProductsTable from '../components/Table/ProductsTable';

const ProductsListPage: React.FC = () => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  const [filters, setFilters] = useState<IProductFilters>({
    page: 1,
    per_page: 20
  });
  
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | -1 | 0 | null>(1);

  const { data, isLoading, error } = useProductsQuery(filters);
  console.log(data);

  const categories = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    const uniqueCategories = [...new Set(data.data.map(p => p.category.name))];
    return uniqueCategories.sort();
  }, [data]);

  const handleFiltersChange = (newFilters: IProductFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (event: any) => {
    setFilters(prev => ({
      ...prev,
      page: event.page + 1,
      per_page: event.rows
    }));
  };

  const handleSort = (event: any) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
    setFilters(prev => ({
      ...prev,
      sort: event.sortField,
      order: event.sortOrder === 1 ? 'asc' : 'desc',
      page: 1
    }));
  };

  if (error) {
    return (
      <Card>
        <div className="text-center p-4">
          <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
          <h3>Erro ao carregar produtos</h3>
          <p className="text-gray-600">Verifique sua conexão e tente novamente.</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">Catálogo de Produtos</h1>
            {data && (
              <p className="page-subtitle">
                {data?.total || 0} produtos encontrados
              </p>
            )}
          </div>
          <Button
            label="Filtros"
            onClick={() => setShowFiltersModal(true)}
            severity="info"
            outlined
          >
            &nbsp;<i className="pi pi-filter"></i>
          </Button>
        </div>
      </div>

      <ProductFiltersModal
        visible={showFiltersModal}
        onHide={() => setShowFiltersModal(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        loading={isLoading}
      />

      <Card>
        {isLoading ? (
          <div className="text-center p-6">
            <ProgressSpinner />
            <p className="mt-3 text-gray-600">Carregando produtos...</p>
          </div>
        ) : (
          <>
            <ProductsTable
              products={data?.data || []}
              loading={isLoading}
              totalRecords={data?.total || 0}
              onPageChange={handlePageChange}
              onSort={handleSort}
              currentPage={data?.current_page || 1}
              rowsPerPage={data?.per_page || 20}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default ProductsListPage;