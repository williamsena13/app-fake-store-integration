import React from 'react';
import { Button } from 'primereact/button';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  return (
    <div className="layout-topbar">
      <div className="flex align-items-center">
        <Button
          className="p-button-text p-button-plain mr-3 lg:hidden"
          onClick={onToggleSidebar}
        >
          <i className="pi pi-bars"></i>
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800">
          Integração Fake Store
        </h1>
      </div>
      
      <div className="flex align-items-center gap-2">
        <span className="text-sm text-gray-600">
          Client ID: {import.meta.env.VITE_CLIENT_ID}
        </span>
      </div>
    </div>
  );
};

export default Topbar;