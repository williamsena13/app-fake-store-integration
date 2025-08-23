import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { formatCurrency, truncateText, formatDate } from '@/lib/format.ts';
import { FrontEndRoutes } from '@/config/front-end-routes';
import CachedImage from '../CachedImage';

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  totalRecords?: number;
  onPageChange?: (event: any) => void;
  onSort?: (event: any) => void;
  currentPage?: number;
  rowsPerPage?: number;
  showPagination?: boolean;
  showHeader?: boolean;
  title?: string;
  showDates?: boolean;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null | undefined;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  loading = false, 
  totalRecords = 0,
  onPageChange,
  onSort,
  currentPage = 1,
  rowsPerPage = 20,
  showPagination = true,
  showHeader = true,
  title = 'Produtos',
  showDates = true,
  sortField,
  sortOrder
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const navigate = useNavigate();
  const [filters] = useState<any>({});
  const [expandedRows, setExpandedRows] = useState<any>(null);

  const imageBodyTemplate = (product: Product) => {
    return (
      <CachedImage
        src={product.image_url || '/no-image.png'}
        alt={product.title}
        width="50"
        height="50"
        className="border-round"
        preview
      />
    );
  };

  const titleBodyTemplate = (product: Product) => {
    return (
      <div>
        <div className="font-semibold">{truncateText(product.title, 50)}</div>
        <div className="text-sm text-gray-600 mt-1">
          {truncateText(product.description, 80)}
        </div>
      </div>
    );
  };

  const categoryBodyTemplate = (product: Product) => {
    return (
      <div className="text-center">
        <Tag value={product.category.name} className="p-tag-rounded" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} />
      </div>
    );
  };

  const priceBodyTemplate = (product: Product) => {
    return (
      <div className="text-right">
        <div className="font-semibold text-lg">{formatCurrency(parseFloat(product.price))}</div>
      </div>
    );
  };

  const actionsBodyTemplate = (product: Product) => {
    return (
      <div className="flex gap-2">
        <Button
          className="p-button-rounded p-button-text"
          tooltip="Ver detalhes"
          onClick={() => navigate(FrontEndRoutes.PRODUCTS.DETAIL.replace(':id', product.id.toString()))}
        >
          <i className="pi pi-eye"></i>
        </Button>
      </div>
    );
  };

  const renderHeader = () => {
    if (!showHeader) return null;
    return (
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">{title} ({showPagination ? totalRecords : safeProducts.length})</h5>
      </div>
    );
  };
  
  const rowExpansionTemplate = (data: Product) => {
    return (
      <div className="p-3">
        <div className="grid">
          <div className="col-12 md:col-4">
            <CachedImage
              src={data.image_url || '/no-image.png'}
              alt={data.title}
              width="200"
              className="border-round"
              preview
            />
          </div>
          <div className="col-12 md:col-8">
            <h5>{data.title}</h5>
            <p className="line-height-3 mb-3">{data.description}</p>
            <div className="grid">
              <div className="col-6">
                <strong>Categoria:</strong> {data.category.name}
              </div>
              <div className="col-6">
                <strong>Preço:</strong> {formatCurrency(parseFloat(data.price))}
              </div>
              {showDates && (
                <>
                  <div className="col-6">
                    <strong>Criado em:</strong> {formatDate(data.created_at)}
                  </div>
                  <div className="col-6">
                    <strong>Atualizado em:</strong> {formatDate(data.updated_at)}
                  </div>
                </>
              )}
            </div>
            <div className="mt-3">
              <Button
                label="Ver Detalhes Completos"
                icon="pi pi-external-link"
                onClick={() => navigate(FrontEndRoutes.PRODUCTS.DETAIL.replace(':id', data.id.toString()))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataTable
      value={safeProducts}
      loading={loading}
      paginator={showPagination}
      rows={showPagination ? rowsPerPage : undefined}
      totalRecords={showPagination ? totalRecords : undefined}
      lazy={showPagination}
      first={showPagination ? (currentPage - 1) * rowsPerPage : undefined}
      onPage={showPagination ? onPageChange : undefined}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={onSort}
      className="p-datatable-sm"
      emptyMessage="Nenhum produto encontrado"
      filters={filters}
      globalFilterFields={['title', 'category.name']}
      header={renderHeader()}
      rowsPerPageOptions={showPagination ? [10, 20, 50, 100] : undefined}
      paginatorTemplate={showPagination ? "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" : undefined}
      currentPageReportTemplate={showPagination ? "Mostrando {first} a {last} de {totalRecords} produtos" : undefined}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
      dataKey="id"
    >
      <Column expander style={{ width: '3rem' }} />
      <Column
        field="image"
        header="Imagem"
        body={imageBodyTemplate}
        style={{ width: '80px' }}
      />
      <Column
        field="title"
        header="Produto"
        body={titleBodyTemplate}
        sortable
        style={{ minWidth: '300px' }}
      />
      <Column
        field="category.name"
        header="Categoria"
        body={categoryBodyTemplate}
        sortable
        style={{ width: '150px', textAlign: 'center' }}
      />
      <Column
        field="price"
        header="Preço"
        body={priceBodyTemplate}
        sortable
        style={{ width: '150px' }}
      />
      {showDates && (
        <Column
          field="created_at"
          header="Criado em"
          body={(product) => (
            <div className="text-sm">
              <div>{formatDate(product.created_at)}</div>
            </div>
          )}
          sortable
          style={{ width: '120px' }}
        />
      )}
      {showDates && (
        <Column
          field="updated_at"
          header="Atualizado em"
          body={(product) => (
            <div className="text-sm">
              <div>{formatDate(product.updated_at)}</div>
            </div>
          )}
          sortable
          style={{ width: '120px' }}
        />
      )}
      <Column
        header="Ações"
        body={actionsBodyTemplate}
        style={{ width: '100px' }}
      />
    </DataTable>
  );
};

export default ProductsTable;