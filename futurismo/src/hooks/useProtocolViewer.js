import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';

const useProtocolViewer = (protocol) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const getPriorityColor = (priority) => {
    const colors = {
      alta: 'bg-red-100 text-red-800 border-red-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baja: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getContactTypeIcon = (type) => {
    const icons = {
      emergency: '🚨',
      coordinator: '👔',
      management: '🏢',
      police: '👮',
      medical: '🏥',
      insurance: '📋',
      towing: '🚛',
      weather: '🌦️',
      local: '🏛️',
      operations: '⚙️'
    };
    return icons[type] || '📞';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      alta: '🔴',
      media: '🟡',
      baja: '🟢'
    };
    return icons[priority] || '⚪';
  };

  const importantReminders = [
    t('emergency.protocol.stayCalm'),
    t('emergency.protocol.touristSafety'),
    t('emergency.protocol.documentIncidents'),
    t('emergency.protocol.contactCoordinator'),
    t('emergency.protocol.followProtocols')
  ];

  const stats = {
    steps: protocol?.content?.steps?.length || 0,
    contacts: protocol?.content?.contacts?.length || 0,
    materials: protocol?.content?.materials?.length || 0,
    priorityIcon: getPriorityIcon(protocol?.priority)
  };

  const canEdit = user?.role === 'admin';

  return {
    t,
    user,
    getPriorityColor,
    getContactTypeIcon,
    getPriorityIcon,
    importantReminders,
    stats,
    canEdit
  };
};

export default useProtocolViewer;