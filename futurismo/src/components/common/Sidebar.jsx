import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, MapIcon, CalendarIcon, ClockIcon, ChatBubbleLeftRightIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, CogIcon, UserGroupIcon, DocumentTextIcon, CalendarDaysIcon, BuildingOffice2Icon, ShieldCheckIcon, ChartBarIcon, StarIcon, UserCircleIcon, CurrencyDollarIcon, MagnifyingGlassIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // Menú diferente según el tipo de usuario
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

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
            <span className="text-2xl">🌎</span>
            {isOpen && (
              <h1 className="ml-3 text-xl font-bold text-gray-900">Futurismo</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors lg:block hidden"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* MapIcon */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors group relative ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`text-center ${!isOpen && 'hidden'}`}>
          <p className="text-xs text-gray-500">
            © 2024 Futurismo
          </p>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default Sidebar;