import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { USER_STATUS, USER_ROLES, GUIDE_TYPES } from '../../constants/usersConstants';
import { getRoleColor, getRoleName, getStatusClasses } from '../../utils/usersHelpers';

const UserTableRow = ({ 
  user, 
  roles,
  onView, 
  onEdit, 
  onDelete, 
  onPasswordReset, 
  onStatusToggle,
  formatLastLogin 
}) => {
  const { t } = useTranslation();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={user.avatar}
            alt={user.firstName}
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
            <div className="text-xs text-gray-400">
              @{user.username}
            </div>
            {user.role === USER_ROLES.AGENCY && user.ruc && (
              <div className="text-xs text-gray-400">
                RUC: {user.ruc}
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(user.role, roles)}-100 text-${getRoleColor(user.role, roles)}-800`}>
          {getRoleName(user.role, roles)}
        </span>
        {user.role === USER_ROLES.GUIDE && user.guideType && (
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              user.guideType === GUIDE_TYPES.PLANT 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.guideType === GUIDE_TYPES.PLANT ? t('users.guideType.plant') : t('users.guideType.freelance')}
            </span>
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="text-sm font-medium">{user.company}</div>
        {user.role === USER_ROLES.GUIDE && user.specialties && (
          <div className="text-xs text-gray-500">
            {user.specialties.slice(0, 2).join(', ')}
            {user.specialties.length > 2 && '...'}
          </div>
        )}
        {user.role === USER_ROLES.AGENCY && user.address && (
          <div className="text-xs text-gray-500">
            {user.address}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(user.status)}`}>
          {user.status === USER_STATUS.ACTIVE ? t('users.status.active') : t('users.status.inactive')}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatLastLogin(user.lastLogin)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onView && onView(user)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            title={t('users.list.viewDetails')}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit && onEdit(user)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title={t('users.list.editUser')}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onPasswordReset(user.id)}
            className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
            title={t('users.list.resetPassword')}
          >
            <KeyIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onStatusToggle(user.id)}
            className={`p-1 rounded ${
              user.status === USER_STATUS.ACTIVE
                ? 'text-red-600 hover:text-red-900'
                : 'text-green-600 hover:text-green-900'
            }`}
            title={user.status === USER_STATUS.ACTIVE ? t('users.list.deactivate') : t('users.list.activate')}
          >
            {user.status === USER_STATUS.ACTIVE ? (
              <XCircleIcon className="h-4 w-4" />
            ) : (
              <CheckCircleIcon className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={() => onDelete && onDelete(user)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title={t('users.list.deleteUser')}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;