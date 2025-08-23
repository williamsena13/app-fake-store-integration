import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProductFilters as IProductFilters } from '../../types';

interface ProductFiltersModalProps {
  visible: boolean;
  onHide: () => void;
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  categories: string[];
  loading?: boolean;
}

const ProductFiltersModal: React.FC<ProductFiltersModalProps> = ({
  visible,
  onHide,
  filters,
  onFiltersChange,
  categories,
  loading = false
}) => {
  const [localFilters, setLocalFilters] = React.useState<IProductFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof IProductFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange({ ...localFilters, page: 1 });
    onHide();
  };

  const clearFilters = () => {
    const clearedFilters: IProductFilters = {
      page: 1,
      per_page: localFilters.per_page || 20
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onHide();
  };

  const hasAnyFilter = !!(
    localFilters.q ||
    (localFilters.categories && localFilters.categories.length > 0) ||
    localFilters.min_price ||
    localFilters.max_price ||
    localFilters.sort
  );

  const sortOptions = [
    { label: 'Preço', value: 'price' },
    { label: 'Título', value: 'title' }
  ];

  const orderOptions = [
    { label: 'Crescente', value: 'asc' },
    { label: 'Decrescente', value: 'desc' }
  ];

  const categoryOptions = categories.map(cat => ({
    label: cat,
    value: cat
  }));

  const footer = (
    <div className="flex justify-content-end gap-2">
      {hasAnyFilter && (
        <Button
          label="Limpar"
          severity="secondary"
          outlined
          onClick={clearFilters}
          disabled={loading}
        >
          &nbsp;<i className="pi pi-times"></i>
        </Button>
      )}
      <Button
        label="Aplicar Filtros"
        onClick={applyFilters}
        disabled={loading}
      >
        &nbsp;<i className="pi pi-search"></i>
      </Button>
    </div>
  );

  return (
    <Dialog
      header="Filtros dos Produtos"
      visible={visible}
      onHide={onHide}
      style={{ width: '600px' }}
      footer={footer}
      modal
      className="p-fluid"
    >
      <div className="formgrid grid">
        <div className="field col-12">
          <label htmlFor="search">Buscar Produto</label>
          <InputText
            id="search"
            value={localFilters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            placeholder="Digite o nome do produto..."
            disabled={loading}
          />
        </div>

        <div className="field col-12">
          <label htmlFor="category">Categorias</label>
          <MultiSelect
            id="category"
            value={localFilters.categories || []}
            onChange={(e) => handleFilterChange('categories', e.value)}
            options={categoryOptions}
            placeholder="Selecione uma ou mais categorias"
            display="chip"
            disabled={loading}
            maxSelectedLabels={3}
          />
        </div>

        <div className="field col-6">
          <label htmlFor="minPrice">Preço Mínimo</label>
          <InputNumber
            id="minPrice"
            value={localFilters.min_price || null}
            onValueChange={(e) => handleFilterChange('min_price', e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            disabled={loading}
          />
        </div>

        <div className="field col-6">
          <label htmlFor="maxPrice">Preço Máximo</label>
          <InputNumber
            id="maxPrice"
            value={localFilters.max_price || null}
            onValueChange={(e) => handleFilterChange('max_price', e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            disabled={loading}
          />
        </div>

        <div className="field col-6">
          <label htmlFor="sortField">Ordenar por</label>
          <Dropdown
            id="sortField"
            value={localFilters.sort || ''}
            onChange={(e) => handleFilterChange('sort', e.value)}
            options={sortOptions}
            placeholder="Selecione o campo"
            disabled={loading}
            showClear
          />
        </div>

        <div className="field col-6">
          <label htmlFor="sortOrder">Ordem</label>
          <Dropdown
            id="sortOrder"
            value={localFilters.order || 'asc'}
            onChange={(e) => handleFilterChange('order', e.value)}
            options={orderOptions}
            disabled={loading}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ProductFiltersModal;