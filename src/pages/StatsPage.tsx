import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chart } from 'primereact/chart';

import { useStatsQuery, useCheapestProductsQuery } from '../api/products';
import { formatCurrency, formatNumber } from '../lib/format';
import ProductsTable from '../components/Table/ProductsTable';

const StatsPage: React.FC = () => {
  const { data: stats, isLoading, error } = useStatsQuery();
  const { data: cheapestProducts, isLoading: cheapestLoading } = useCheapestProductsQuery();

  if (isLoading) {
    return (
      <Card>
        <div className="text-center p-6">
          <ProgressSpinner />
          <p className="mt-3 text-gray-600">Carregando estatísticas...</p>
        </div>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <div className="text-center p-4">
          <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
          <h3>Erro ao carregar estatísticas</h3>
          <p className="text-gray-600">Verifique sua conexão e tente novamente.</p>
        </div>
      </Card>
    );
  }

  // Dados para o gráfico de categorias
  const chartData = {
    labels: stats.by_category.map(cat => cat.category),
    datasets: [
      {
        data: stats.by_category.map(cat => cat.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Estatísticas</h2>
      </div>

      <div className="grid mb-4">
        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card fade-in-up">
            <div className="stats-card-header">
              <div className="stats-card-icon">
                <i className="pi pi-shopping-cart"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{formatNumber(stats.total_products)}</div>
                <div className="stats-card-label">Total de Produtos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card fade-in-up">
            <div className="stats-card-header">
              <div className="stats-card-icon">
                <i className="pi pi-dollar"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value small">{formatCurrency(stats.avg_price)}</div>
                <div className="stats-card-label">Preço Médio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card fade-in-up">
            <div className="stats-card-header">
              <div className="stats-card-icon">
                <i className="pi pi-tags"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{stats.by_category.length}</div>
                <div className="stats-card-label">Categorias</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card fade-in-up">
            <div className="stats-card-header">
              <div className="stats-card-icon">
                <i className="pi pi-star"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{stats.top5_expensive.length}</div>
                <div className="stats-card-label">Top Produtos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 md:col-6">
          <Card title="Produtos por Categoria">
            <div style={{ height: '300px' }} className="md:h-400px">
              <Chart
                type="doughnut"
                data={chartData}
                options={chartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="Detalhes por Categoria">
            <DataTable
              value={stats.by_category}
              className="p-datatable-sm"
              emptyMessage="Nenhuma categoria encontrada"
            >
              <Column
                field="category"
                header="Categoria"
                body={(rowData) => (
                  <div className="flex align-items-center gap-2">
                    <i className="pi pi-tag text-primary"></i>
                    <span className="font-semibold">{rowData.category}</span>
                  </div>
                )}
              />
              <Column
                field="total"
                header="Produtos"
                body={(rowData) => (
                  <div className="text-center">
                    <span className="p-tag p-tag-info" style={{ fontSize: '1.1rem', padding: '0.6rem 1rem', fontWeight: 'bold' }}>
                      {formatNumber(rowData.total)}
                    </span>
                  </div>
                )}
                style={{ width: '140px' }}
              />
            </DataTable>
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="Top 5 Produtos Mais Caros">
            <ProductsTable
              products={stats.top5_expensive.map(product => ({
                ...product,
                category: {
                  id: 0,
                  name: product.category_name
                },
                created_at: '',
                updated_at: ''
              }))}
              loading={false}
              showPagination={false}
              showHeader={false}
              showDates={false}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6">
          <Card title="Top 5 Produtos Mais Baratos">
            <ProductsTable
              products={cheapestProducts || []}
              loading={cheapestLoading}
              showPagination={false}
              showHeader={false}
              showDates={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;