import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import useSidebarMenu from '../../hooks/useSidebarMenu';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

const AppSidebar = () => {
  const { closeSidebar, viewport } = useLayout();
  const { menuItems, handleNavClick } = useSidebarMenu();

  return (
    <div className="h-full bg-white shadow-lg flex flex-col">
      <SidebarHeader 
        isMobile={viewport.isMobile} 
        onClose={closeSidebar} 
      />

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <SidebarFooter />
    </div>
  );
};

export default AppSidebar;