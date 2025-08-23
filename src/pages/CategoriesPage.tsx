import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { FilterMatchMode } from 'primereact/api';
import { useCategoriesQuery, useProductsByCategoryQuery } from '../api/products';
import { Category } from '@/types';


const CategoryProductsComponent: React.FC<{ category: Category }> = ({ category }) => {
  const { data: products, isLoading: productsLoading } = useProductsByCategoryQuery(category.name, true);
  <div className="col-12 sm:col-12 lg:col-8">
    </div>
  const productTemplate = (product: any) => {
    return (

      <div className="col-12 sm:col-6 md:col-6 lg:col-3">
        <Card className="product-card h-full">
          <div className="product-image-container">
            <img
              src={product.image_url}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          </div>
          <div className="product-info">
            <h6 className="product-title">{product.title}</h6>
            <div className="product-price">${product.price}</div>
            <div className="product-category">
              <i className="pi pi-tag"></i>
              <span>{product.category?.name || category.name}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-3">
      <h5 className="mb-3 flex align-items-center gap-2">
        <i className="pi pi-tag text-primary"></i>
        Produtos da categoria "{category.name}"
        <span className="p-tag p-tag-secondary ml-2">{products?.length || 0} produtos</span>
      </h5>
      {productsLoading ? (
        <div className="text-center p-4">
          <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />
          <p className="mt-2 text-sm text-gray-600">Carregando produtos...</p>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <i className="pi pi-inbox text-4xl mb-3"></i>
          <p>Nenhum produto encontrado nesta categoria</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => productTemplate(product))}
        </div>
      )}
    </div>
  );
};

const CategoryProductsTemplate = (data: Category) => {
  return <CategoryProductsComponent category={data} />;
};

const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading, error } = useCategoriesQuery();
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [filters, ] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    products_count: { value: null, matchMode: FilterMatchMode.EQUALS },
    created_at: { value: null, matchMode: FilterMatchMode.DATE_IS }
  });

  const renderHeader = () => {
    return (
      <div style={{ padding: '0.25rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Categorias ({categories?.length || 0})</span>
      </div>
    );
  };

  const nameBodyTemplate = (rowData: Category) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-tag text-primary"></i>
        <span className="font-semibold">{rowData.name}</span>
      </div>
    );
  };

  const productsCountBodyTemplate = (rowData: Category) => {
    return (
      <div className="text-center">
        <Tag 
          value={`${rowData.products_count} produtos`} 
          severity={rowData.products_count > 0 ? 'success' : 'secondary'}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontSize: '0.875rem',
            border: '2px solid #22c55e',
            borderRadius: '1rem'
          }}
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Category) => {
    return new Date(rowData.created_at).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Message 
        severity="error" 
        text="Erro ao carregar categorias" 
        className="w-full" 
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categorias</h1>
        <p className="page-subtitle">Visualize todas as categorias de produtos disponíveis</p>
      </div>

      <Card>
        <DataTable 
          value={categories} 
          paginator 
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorias"
          className="p-datatable-sm"
          emptyMessage="Nenhuma categoria encontrada"
          responsiveLayout="scroll"
          expandedRows={expandedRows}
          onRowToggle={(e) => {
            setExpandedRows(e.data);
          }}
          rowExpansionTemplate={CategoryProductsTemplate}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          header={renderHeader()}
        >
          <Column expander style={{ width: '3rem' }} />
          <Column 
            field="name" 
            header="Nome da Categoria" 
            body={nameBodyTemplate}
            sortable
            filter
            filterPlaceholder="Buscar por nome"
            showFilterMenu={false}
            showFilterOperator={false}
          />
          <Column 
            field="products_count" 
            header="Produtos" 
            body={productsCountBodyTemplate}
            sortable
            filter
            filterPlaceholder="Qtd produtos"
            showFilterMenu={false}
            showFilterOperator={false}
            style={{ width: '200px', textAlign: 'center' }}
          />
          <Column 
            field="created_at" 
            header="Criado em" 
            body={dateBodyTemplate}
            sortable
            filter
            filterType="date"
            filterPlaceholder="Data"
            showFilterMenu={false}
            showFilterOperator={false}
            style={{ width: '150px' }}
          />
        </DataTable>
      </Card>
    </div>
  );
};

export default CategoriesPage;