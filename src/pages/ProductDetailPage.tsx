import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import { ProgressSpinner } from 'primereact/progressspinner';
import { useProductQuery } from '../api/products';
import { formatCurrency } from '../lib/format';
import {FrontEndRoutes} from "@/config/front-end-routes.ts";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const productId = parseInt(id || '0');
  const { data: product, isLoading, error } = useProductQuery(productId);

  if (isLoading) {
    return (
      <Card>
        <div className="text-center p-6">
          <ProgressSpinner />
          <p className="mt-3 text-gray-600">Carregando produto...</p>
        </div>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card>
        <div className="text-center p-4">
          <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
          <h3>Produto não encontrado</h3>
          <p className="text-gray-600 mb-4">O produto solicitado não foi encontrado.</p>
          <Button
            label="Voltar aos Produtos"
            severity="info"
            onClick={() => navigate(FrontEndRoutes.PRODUCTS.LIST)}
          >
            &nbsp;<i className="pi pi-arrow-left"></i>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <Button
          label="Voltar"
          severity="secondary"
          outlined
          onClick={() => navigate(FrontEndRoutes.PRODUCTS.LIST)}
        >
          &nbsp;<i className="pi pi-arrow-left"></i>
        </Button>
      </div>

      <div className="grid">
        <div className="col-12 md:col-4">
          <Card>
            <div className="text-center product-image-detail-container">
              {imageLoading && !imageError && (
                <div className="image-loading-overlay">
                  <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />
                  <p className="mt-2 text-sm text-gray-600">Carregando imagem...</p>
                </div>
              )}
              <img
                src={imageError ? 'https://via.placeholder.com/400x400?text=Imagem+Indispon%C3%ADvel' : product.image_url}
                alt={product.title}
                className={`product-detail-image ${imageLoading ? 'loading' : ''}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-8">
          <Card>
            <div className="mb-3">
              <Tag value={product.category.name} className="p-tag-rounded mb-2" />
              <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-3">
                {product.title}
              </h1>
            </div>

            <div className="mb-4">
              <div className="flex align-items-center gap-3 mb-3">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(parseFloat(product.price))}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 line-height-3">
                {product.description}
              </p>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-3 border-1 border-gray-200 border-round">
                  <h4 className="font-semibold mb-2">Informações do Produto</h4>
                  <div className="flex justify-content-between mb-2">
                    <span>ID:</span>
                    <span className="font-semibold">#{product.id}</span>
                  </div>
                  <div className="flex justify-content-between mb-2">
                    <span>Categoria:</span>
                    <span className="font-semibold">{product.category.name}</span>
                  </div>

                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;