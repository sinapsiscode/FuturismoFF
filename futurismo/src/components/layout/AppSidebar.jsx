import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLayout } from '../../contexts/LayoutContext';
import { 
  HomeIcon, 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  XMarkIcon,
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ChartBarIcon,
  StarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const AppSidebar = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { closeSidebar, viewport } = useLayout();
  
  // Configuración de menú según rol
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.searchGuides') },
        { path: '/marketplace/requests', icon: BriefcaseIcon, label: t('navigation.myContracts') },
        { path: '/agency/calendar', icon: CalendarDaysIcon, label: t('navigation.calendar') },
        { path: '/agency/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/agency/points', icon: StarIcon, label: t('navigation.points') },
        { path: '/history', icon: ClockIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
        { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
      ];
    } else if (user?.role === 'guide') {
      const guideItems = [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.myTours') },
        { path: '/history', icon: ClockIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') }
      ];
      
      // Agregar opciones específicas para guías freelance
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.myAgenda') });
        guideItems.splice(-1, 0, { path: '/marketplace/guide-dashboard', icon: BriefcaseIcon, label: t('navigation.myServices') });
        guideItems.splice(-1, 0, { path: '/guide/finances', icon: CurrencyDollarIcon, label: t('navigation.finances') });
      }
      
      guideItems.splice(-1, 0, { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') });
      guideItems.push({ path: '/profile', icon: UserIcon, label: t('navigation.profile') });
      return guideItems;
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/admin/reservations', icon: CalendarIcon, label: t('navigation.reservationManagement') },
        { path: '/assignments', icon: UserCircleIcon, label: t('navigation.assignments') },
        { path: '/guides', icon: UserIcon, label: t('navigation.guides') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') },
        { path: '/providers', icon: BuildingOffice2Icon, label: t('navigation.providers') },
        { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') },
        { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.coordination') },
        { path: '/admin/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/history', icon: DocumentTextIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
        { path: '/users', icon: UserGroupIcon, label: t('navigation.users') },
        { path: '/settings', icon: CogIcon, label: t('navigation.settings') },
        { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
      ];
    }
    
    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleNavClick = () => {
    // Cerrar sidebar en móvil al navegar
    if (viewport.isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl">🌎</span>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Futurismo</h1>
          </div>
          
          {/* Botón cerrar en móvil */}
          {viewport.isMobile && (
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Futurismo
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;