import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useUserList } from '../../hooks/useUserList';
import { formatFullDateTime } from '../../utils/usersHelpers';
import { DEFAULT_VALUES } from '../../constants/usersConstants';
import UserStatCards from './UserStatCards';
import UserFilters from './UserFilters';
import UserTableRow from './UserTableRow';

const UserList = ({ onEdit, onView, onDelete }) => {
  const { t } = useTranslation();
  const {
    users,
    stats,
    roleStats,
    roles,
    showFilters,
    filters,
    handleSearch,
    handleFilterChange,
    handleStatusToggle,
    handlePasswordReset,
    clearFilters,
    setShowFilters,
    hasActiveFilters
  } = useUserList();

  const onPasswordReset = (userId) => {
    if (window.confirm(t('users.list.confirmPasswordReset'))) {
      handlePasswordReset(userId, null, (password) => {
        alert(t('users.list.passwordResetSuccess', { password }));
      });
    }
  };

  const getFormattedLastLogin = (lastLogin) => {
    const formatted = formatFullDateTime(lastLogin);
    return formatted || t('users.list.never');
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <UserStatCards roleStats={roleStats} />

      {/* Barra de búsqueda y filtros */}
      <UserFilters
        filters={filters}
        roles={roles}
        showFilters={showFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters()}
      />

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.companyType')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.lastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  roles={roles}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPasswordReset={onPasswordReset}
                  onStatusToggle={handleStatusToggle}
                  formatLastLogin={getFormattedLastLogin}
                />
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('users.list.noUsers')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters()
                ? t('users.list.noUsersWithFilters')
                : t('users.list.createFirstUser')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;