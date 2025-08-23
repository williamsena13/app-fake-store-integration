import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { FrontEndRoutes } from '../config/front-end-routes';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Ver Produtos',
      description: 'Navegar pelo catálogo de produtos',
      icon: 'pi pi-shopping-cart',
      color: 'bg-blue-500',
      action: () => navigate(FrontEndRoutes.PRODUCTS.LIST)
    },
    {
      title: 'Dashboard',
      description: 'Visualizar estatísticas e métricas',
      icon: 'pi pi-chart-bar',
      color: 'bg-green-500',
      action: () => navigate(FrontEndRoutes.STATS)
    },
    {
      title: 'Sincronização',
      description: 'Sincronizar dados com Fake Store API',
      icon: 'pi pi-sync',
      color: 'bg-orange-500',
      action: () => navigate(FrontEndRoutes.SYNC)
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Bem-vindo ao Fake Store Integration
        </h1>
        <p className="page-subtitle">
          Sistema de integração e gerenciamento de produtos da Fake Store API
        </p>
      </div>

      <div className="grid">
        {quickActions.map((action, index) => (
          <div key={index} className="col-12 sm:col-6 lg:col-4">
            <div className="action-card fade-in-up" onClick={action.action}>
              <div className="action-card-icon">
                <i className={action.icon}></i>
              </div>
              <h3 className="action-card-title">{action.title}</h3>
              <p className="action-card-description">{action.description}</p>
              <Button
                label="Acessar"
                severity="info"
                outlined
              >
                &nbsp;<i className="pi pi-arrow-right"></i>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <div className="p-card-body">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Sobre o Front-End</h3>
                <p className="text-gray-600 mb-3 line-height-3">
                  Interface moderna desenvolvida em React com TypeScript, 
                  oferecendo experiência de usuário intuitiva e responsiva.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-2 border-round text-sm font-medium">React 18</span>
                  <span className="bg-green-100 text-green-800 px-3 py-2 border-round text-sm font-medium">TypeScript</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-2 border-round text-sm font-medium">PrimeReact</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-2 border-round text-sm font-medium">Vite</span>
                  <span className="bg-red-100 text-red-800 px-3 py-2 border-round text-sm font-medium">React Query</span>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Sobre o Back-End</h3>
                <p className="text-gray-600 mb-3 line-height-3">
                  API robusta desenvolvida em Laravel com arquitetura limpa, 
                  integração externa e tratamento avançado de erros.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-red-100 text-red-800 px-3 py-2 border-round text-sm font-medium">Laravel 10</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-2 border-round text-sm font-medium">PHP 8.1+</span>
                  <span className="bg-green-100 text-green-800 px-3 py-2 border-round text-sm font-medium">MySQL</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-2 border-round text-sm font-medium">Eloquent ORM</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-2 border-round text-sm font-medium">Spatie ActivityLog</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;