import React from 'react';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useProductActivityQuery } from '@/api/products';
import { ActivityLog } from '@/types';

interface ProductActivityLogProps {
  productId: number;
}

const ProductActivityLog: React.FC<ProductActivityLogProps> = ({ productId }) => {
  const { data: activities, isLoading, error } = useProductActivityQuery(productId);

  const getEventSeverity = (event: string) => {
    switch (event) {
      case 'created': return 'success';
      case 'updated': return 'info';
      case 'deleted': return 'danger';
      default: return 'secondary';
    }
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'created': return 'pi pi-plus';
      case 'updated': return 'pi pi-pencil';
      case 'deleted': return 'pi pi-trash';
      default: return 'pi pi-info-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getChangesText = (activity: ActivityLog) => {
    const { properties } = activity;
    
    if (activity.event === 'created') {
      return 'Produto criado no sistema';
    }
    
    if (activity.event === 'updated' && properties.old && properties.attributes) {
      const changes: string[] = [];
      
      Object.keys(properties.attributes).forEach(key => {
        if (properties.old![key] !== properties.attributes![key]) {
          const oldValue = properties.old![key];
          const newValue = properties.attributes![key];
          
          switch (key) {
            case 'title':
              changes.push(`Título alterado de "${oldValue}" para "${newValue}"`);
              break;
            case 'price':
              changes.push(`Preço alterado de R$ ${oldValue} para R$ ${newValue}`);
              break;
            case 'description':
              changes.push('Descrição alterada');
              break;
            case 'image_url':
              changes.push('Imagem alterada');
              break;
            default:
              changes.push(`${key} alterado`);
          }
        }
      });
      
      return changes.length > 0 ? changes.join(', ') : 'Produto atualizado';
    }
    
    if (activity.event === 'deleted') {
      return 'Produto removido do sistema';
    }
    
    return activity.description || 'Atividade registrada';
  };

  const customizedMarker = (item: ActivityLog) => (
    <span 
      className={`flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1`}
      style={{ backgroundColor: getEventSeverity(item.event) === 'success' ? '#22c55e' : 
                                getEventSeverity(item.event) === 'info' ? '#3b82f6' : 
                                getEventSeverity(item.event) === 'danger' ? '#ef4444' : '#6b7280' }}
    >
      <i className={getEventIcon(item.event)}></i>
    </span>
  );

  const customizedContent = (item: ActivityLog) => (
    <Card className="mt-3 ml-3">
      <div className="flex justify-content-between align-items-start mb-2">
        <div className="flex align-items-center gap-2">
          <Tag 
            value={item.event.toUpperCase()} 
            severity={getEventSeverity(item.event) as any}
            className="text-xs"
          />
          <span className="text-sm text-600">por {item.causer.name}</span>
        </div>
        <span className="text-xs text-500">{formatDate(item.created_at)}</span>
      </div>
      <p className="text-700 line-height-3 m-0">
        {getChangesText(item)}
      </p>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <div className="text-center p-4">
          <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />
          <p className="mt-3 text-600">Carregando histórico...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center p-4">
          <i className="pi pi-exclamation-triangle text-3xl text-orange-500 mb-3"></i>
          <p className="text-600">Erro ao carregar histórico de atividades</p>
        </div>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <div className="text-center p-4">
          <i className="pi pi-info-circle text-3xl text-blue-500 mb-3"></i>
          <p className="text-600">Nenhuma atividade registrada para este produto</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 flex align-items-center gap-2">
        <i className="pi pi-history text-blue-500"></i>
        Histórico de Atividades
      </h3>
      <Timeline 
        value={activities} 
        marker={customizedMarker}
        content={customizedContent}
        className="customized-timeline"
      />
    </Card>
  );
};

export default ProductActivityLog;