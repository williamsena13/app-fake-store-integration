import React from 'react';
import { NavLink } from 'react-router-dom';
import { FrontEndRoutes } from '../../config/front-end-routes';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      path: FrontEndRoutes.HOME
    },
    {
      label: 'Produtos',
      icon: 'pi pi-shopping-cart',
      path: FrontEndRoutes.PRODUCTS.LIST
    },
    {
      label: 'Categorias',
      icon: 'pi pi-tags',
      path: FrontEndRoutes.CATEGORIES
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      path: FrontEndRoutes.STATS
    },
    {
      label: 'Sincronização',
      icon: 'pi pi-sync',
      path: FrontEndRoutes.SYNC
    }
  ];

  return (
    <div className={`layout-sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h2>
          <i className="pi pi-shopping-bag mr-2"></i>
          Fake Store
        </h2>
      </div>
      
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <i className={item.icon}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <small>Fake Store Integration</small>
          <small>v{import.meta.env.VERSION || '1.0.0'}</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;