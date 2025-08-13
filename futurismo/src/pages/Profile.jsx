import { useState } from 'react';
import FreelanceAvailabilityView from '../components/common/FreelanceAvailabilityView';
import { UserIcon, CalendarIcon, BuildingOfficeIcon, PhoneIcon, CreditCardIcon, ShieldCheckIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import CompanyDataSection from '../components/profile/CompanyDataSection';
import ContactDataSection from '../components/profile/ContactDataSection';
import PaymentDataSection from '../components/profile/PaymentDataSection';
import AdminCompanyDataSection from '../components/profile/AdminCompanyDataSection';
import AdminContactDataSection from '../components/profile/AdminContactDataSection';
import AdminPaymentDataSection from '../components/profile/AdminPaymentDataSection';
import AccountStatusSection from '../components/profile/AccountStatusSection';
import DocumentsSection from '../components/profile/DocumentsSection';
import FeedbackSection from '../components/profile/FeedbackSectionSimple';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  // Configurar tabs - Secciones dinámicas según el rol
  const getTabsForRole = () => {
    const baseSections = user?.role === 'admin' 
      ? ['company', 'contact', 'payment']
      : ['company', 'contact', 'payment', 'status', 'documents'];
    const sections = (user?.role === 'agency') 
      ? [...baseSections, 'feedback'] 
      : baseSections;
      
    const tabsList = [
      { id: 'profile', name: t('profile.myProfile'), icon: UserIcon, sections }
    ];
    
    // Solo mostrar guías si no es admin
    if (user?.role !== 'admin') {
      tabsList.push({ id: 'guides', name: t('profile.guideAvailability'), icon: CalendarIcon });
    }
    
    
    return tabsList;
  };

  const tabs = getTabsForRole();

  // Función para generar el encabezado según el rol
  const getProfileHeader = () => {
    const roleLabels = {
      'agency': {
        title: t('profile.agencyProfile'),
        subtitle: t('profile.manageAgencyInfo'),
        gradient: 'from-blue-600 to-purple-600'
      },
      'guide': {
        title: t('profile.guideProfile'),
        subtitle: t('profile.manageGuideInfo'),
        gradient: 'from-green-600 to-teal-600'
      },
      'admin': {
        title: t('profile.adminProfile'),
        subtitle: t('profile.manageAdminInfo'),
        gradient: 'from-red-600 to-pink-600'
      },
      'default': {
        title: t('profile.myProfile'),
        subtitle: t('profile.manageAdminInfo'),
        gradient: 'from-gray-600 to-blue-600'
      }
    };

    const config = roleLabels[user?.role] || roleLabels.default;
    
    return (
      <div className={`bg-gradient-to-r ${config.gradient} rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
            <p className="text-blue-100">{config.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">{t('profile.activeUser')}</p>
            <p className="text-lg font-semibold">{user?.name || 'Usuario'}</p>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile.administration')}</h1>
      
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Header del perfil - dinámico según el rol */}
          {getProfileHeader()}

          {/* Datos de empresa */}
          {user?.role === 'admin' ? <AdminCompanyDataSection /> : <CompanyDataSection />}

          {/* Datos de contacto */}
          {user?.role === 'admin' ? <AdminContactDataSection /> : <ContactDataSection />}

          {/* Datos de pago */}
          {user?.role === 'admin' ? <AdminPaymentDataSection /> : <PaymentDataSection />}

          {/* Estado de la cuenta - No para admin */}
          {user?.role !== 'admin' && <AccountStatusSection />}

          {/* Documentos - No para admin */}
          {user?.role !== 'admin' && <DocumentsSection />}

          {/* Opiniones y sugerencias - Solo para agencias */}
          {user?.role === 'agency' && (
            <FeedbackSection userRole={user?.role} />
          )}

        </div>
      )}

      {activeTab === 'guides' && user?.role !== 'admin' && (
        <FreelanceAvailabilityView />
      )}

    </div>
  );
};

export default Profile;