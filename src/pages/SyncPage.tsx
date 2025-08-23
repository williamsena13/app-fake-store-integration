import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { useSyncMutation } from '../api/products';
import { SyncResponse } from '@/types';
import apiClient from '../api/client';
import { BackEndRoutes } from '../config/back-end-routes';
import toast from 'react-hot-toast';
import { imageCache } from '../lib/imageCache';

const SyncPage: React.FC = () => {
  const [lastSyncResult, setLastSyncResult] = useState<SyncResponse | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [limitValue, setLimitValue] = useState<number>(5);
  const [isDeleting, setIsDeleting] = useState(false);

  const syncMutation = useSyncMutation();

  const handleSync = async (mode: 'full' | 'delta' | 'limited', limit?: number) => {
    try {
      const result = await syncMutation.mutateAsync({ mode, limit });
      setLastSyncResult(result);
      setShowResultDialog(true);
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const handleDeleteAll = () => {
    confirmDialog({
      message: 'Tem certeza que deseja excluir TODOS os produtos? Esta ação não pode ser desfeita.',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sim, excluir tudo',
      rejectLabel: 'Cancelar',
      accept: async () => {
        setIsDeleting(true);
        try {
          await apiClient.delete(`${BackEndRoutes.routes.CATALOGO.PRODUCTS.LIST}/all`);
          toast.success('Todos os produtos foram excluídos com sucesso!');
          setLastSyncResult(null);
          window.location.reload();
        } catch (error) {
          console.error('Erro ao excluir produtos:', error);
          toast.error('Erro ao excluir produtos');
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleClearCache = () => {
    confirmDialog({
      message: 'Tem certeza que deseja limpar o cache de imagens?',
      header: 'Limpar Cache',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim, limpar',
      rejectLabel: 'Cancelar',
      accept: () => {
        imageCache.clearCache();
        toast.success('Cache de imagens limpo com sucesso!');
      }
    });
  };

  const getSyncModeDescription = (mode: 'full' | 'delta' | 'limited') => {
    switch (mode) {
      case 'full':
        return 'Sincroniza todos os produtos da Fake Store API, substituindo dados existentes.';
      case 'delta':
        return 'Sincroniza apenas produtos novos ou modificados desde a última sincronização.';
      case 'limited':
        return 'Sincroniza um número específico de produtos da Fake Store API.';
      default:
        return '';
    }
  };

  const getSyncChartData = () => {
    if (!lastSyncResult) return {};
    const { result } = lastSyncResult;
    
    const data = [];
    const labels = [];
    const colors = [];
    
    if (result.imported > 0) {
      data.push(result.imported);
      labels.push('Importados');
      colors.push('#10b981');
    }
    
    if (result.updated > 0) {
      data.push(result.updated);
      labels.push('Atualizados');
      colors.push('#3b82f6');
    }
    
    if (result.skipped > 0) {
      data.push(result.skipped);
      labels.push('Ignorados');
      colors.push('#f59e0b');
    }
    
    if (result.errors.length > 0) {
      data.push(result.errors.length);
      labels.push('Erros');
      colors.push('#ef4444');
    }
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }]
    };
  };
  
  const getSyncChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  };

  const renderSyncResult = () => {
    if (!lastSyncResult) return null;
    const { result } = lastSyncResult;

    return (
      <div className="grid">
        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-icon" style={{ background: '#10b981' }}>
                <i className="pi pi-plus-circle"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{result.imported}</div>
                <div className="stats-card-label">Importados</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-icon" style={{ background: '#3b82f6' }}>
                <i className="pi pi-refresh"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{result.updated}</div>
                <div className="stats-card-label">Atualizados</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-icon" style={{ background: '#f59e0b' }}>
                <i className="pi pi-minus-circle"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{result.skipped}</div>
                <div className="stats-card-label">Ignorados</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 sm:col-6 lg:col-6">
          <div className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-icon" style={{ background: '#ef4444' }}>
                <i className="pi pi-times-circle"></i>
              </div>
              <div className="stats-card-content">
                <div className="stats-card-value">{result.errors.length}</div>
                <div className="stats-card-label">Erros</div>
              </div>
            </div>
          </div>
        </div>
        
        {result.imported > 0 && result.imported_products && (
          <div className="col-12">
            <Panel header={`Produtos Importados (${result.imported})`} toggleable collapsed className="mb-3">
              <DataTable
                value={result.imported_products}
                className="p-datatable-sm"
                emptyMessage="Nenhum produto importado"
                paginator
                rows={5}
              >
                <Column field="title" header="Produto" />
                <Column field="external_id" header="ID Externo" style={{ width: '120px' }} />
                <Column field="id" header="ID Interno" style={{ width: '120px' }} />
              </DataTable>
            </Panel>
          </div>
        )}
        
        {/* Collapse para Produtos Atualizados */}
        {result.updated > 0 && result.updated_products && (
          <div className="col-12">
            <Panel header={`Produtos Atualizados (${result.updated})`} toggleable collapsed className="mb-3">
              <DataTable
                value={result.updated_products}
                className="p-datatable-sm"
                emptyMessage="Nenhum produto atualizado"
                paginator
                rows={5}
              >
                <Column field="title" header="Produto" />
                <Column field="external_id" header="ID Externo" style={{ width: '120px' }} />
                <Column field="id" header="ID Interno" style={{ width: '120px' }} />
              </DataTable>
            </Panel>
          </div>
        )}
        
        {/* Collapse para Produtos Ignorados */}
        {result.skipped > 0 && result.skipped_products && (
          <div className="col-12">
            <Panel header={`Produtos Ignorados (${result.skipped})`} toggleable collapsed className="mb-3">
              <DataTable
                value={result.skipped_products}
                className="p-datatable-sm"
                emptyMessage="Nenhum produto ignorado"
                paginator
                rows={5}
              >
                <Column field="title" header="Produto" />
                <Column field="external_id" header="ID Externo" style={{ width: '120px' }} />
                <Column field="reason" header="Motivo" />
              </DataTable>
            </Panel>
          </div>
        )}
        
        {/* Erros */}
        {result.errors.length > 0 && (
          <div className="col-12">
            <Message
              severity="error"
              text={`${result.errors.length} erro(s) encontrado(s)`}
              className="w-full mb-3"
            />
            <Panel header="Detalhes dos Erros" toggleable collapsed className="w-full">
              <DataTable
                value={result.errors}
                className="p-datatable-sm"
                emptyMessage="Nenhum erro"
              >
                <Column field="context.product_id" header="ID Produto" style={{ width: '120px' }} />
                <Column field="message" header="Erro" />
              </DataTable>
            </Panel>
          </div>
        )}
        

      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">Sincronização</h1>
            <p className="page-subtitle">Gerencie a sincronização de dados com a Fake Store API</p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Limpar Cache"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              onClick={handleClearCache}
              disabled={syncMutation.isPending || isDeleting}
            />
            <Button
              label="Limpar Dados"
              icon="pi pi-trash"
              severity="danger"
              outlined
              loading={isDeleting}
              onClick={handleDeleteAll}
              disabled={syncMutation.isPending}
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 sm:col-6 lg:col-4">
          <Card title="Sincronização Completa" className="h-full">
            <div className="p-card-body">
              <div className="mb-4">
                <p className="text-gray-600 mb-3 line-height-3">
                  {getSyncModeDescription('full')}
                </p>
                <div className="flex align-items-center gap-2 mb-4">
                  <i className="pi pi-info-circle text-blue-500"></i>
                  <span className="text-sm text-gray-600">
                    Pode demorar alguns minutos para processar todos os produtos
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Button
                    label="Importar Tudo"
                    severity="warning"
                    disabled={syncMutation.isPending}
                    onClick={() => handleSync('full')}
                    className="w-full"
                >
                  &nbsp;<i className="pi pi-download"></i>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 sm:col-6 lg:col-4">
          <Card title="Atualizar Produtos" className="h-full">
            <div className="p-card-body">
              <div className="mb-4">
                <p className="text-gray-600 mb-3 line-height-3">
                  {getSyncModeDescription('delta')}
                </p>
                <div className="flex align-items-center gap-2 mb-4">
                  <i className="pi pi-info-circle text-blue-500"></i>
                  <span className="text-sm text-gray-600">
                    Processo mais rápido, ideal para atualizações regulares
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Button
                    label="Sincronizar Produtos"
                    severity="info"
                    disabled={syncMutation.isPending}
                    onClick={() => handleSync('delta')}
                    className="w-full"
                >
                  &nbsp;<i className="pi pi-refresh"></i>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 sm:col-6 lg:col-4">
          <Card title="Importar por quantidade" className="h-full">
            <div className="p-card-body">
              <div className="mb-4">
                <p className="text-gray-600 mb-3 line-height-3">
                  {getSyncModeDescription('limited')}
                </p>
                <div className="flex align-items-center gap-2 mb-4">
                  <i className="pi pi-info-circle text-blue-500"></i>
                  <span className="text-sm text-gray-600">
                    Ideal para testes ou importações parciais
                  </span>
                </div>
                <div className="field">
                  <label htmlFor="limit" className="block text-sm font-medium mb-2">
                    Número de produtos:
                  </label>
                  <input
                      id="limit"
                      type="number"
                      value={limitValue}
                      onChange={(e) => setLimitValue(parseInt(e.target.value) || 5)}
                      min={1}
                      max={20}
                      className="p-inputtext w-full"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                    label={`Imprtar ${limitValue}`}
                    severity="success"
                    disabled={syncMutation.isPending}
                    onClick={() => handleSync('limited', limitValue)}
                    className="w-full"
                >
                  &nbsp;<i className="pi pi-filter"></i>
                </Button>
              </div>
            </div>
          </Card>
        </div>


        {syncMutation.isPending && (
            <div className="col-12">
            <Card>
              <div className="text-center p-4">
                <ProgressSpinner />
                <h3 className="mt-3 mb-2">Sincronizando...</h3>
                <p className="text-gray-600">
                  Por favor, aguarde enquanto os dados são processados.
                </p>
              </div>
            </Card>
          </div>
        )}

        {lastSyncResult && !syncMutation.isPending && (
            <>
              <div className="col-12 sm:col-12 lg:col-8">
                <Card
                    className="mb-3"
                    title={`Último Resultado da Sincronização (${lastSyncResult.mode}${lastSyncResult.limit ? ` - ${lastSyncResult.limit} produtos` : ''})`}
                >
                  {renderSyncResult()}
                </Card>
              </div>
              <div className="col-12 sm:col-12 lg:col-4">
                <Card title="Resumo da Sincronização">
                  <div style={{height: '300px'}}>
                    <Chart
                        type="pie"
                        data={getSyncChartData()}
                        options={getSyncChartOptions()}
                        style={{height: '100%'}}
                    />
                  </div>
                </Card>
              </div>
            </>
        )}
      </div>

          <Dialog
          header="Sincronização Concluída"
        visible={showResultDialog}
        style={{ width: '80vw', maxWidth: '1000px' }}
        onHide={() => setShowResultDialog(false)}
        maximizable
        footer={
          <Button
            label="Fechar"
            severity="success"
            onClick={() => setShowResultDialog(false)}
          >
            &nbsp;<i className="pi pi-check"></i>
          </Button>
        }
      >
        {lastSyncResult && (
          <div>
            <Message
              severity="success"
              text={`Sincronização ${lastSyncResult.mode} concluída com sucesso!`}
              className="w-full mb-3"
            />
            {renderSyncResult()}
          </div>
        )}
      </Dialog>
      
      <ConfirmDialog />
    </div>
  );
};

export default SyncPage;