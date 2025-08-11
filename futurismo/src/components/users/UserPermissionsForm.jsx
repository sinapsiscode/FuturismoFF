import React from 'react';
import { useTranslation } from 'react-i18next';

const UserPermissionsForm = ({
  permissionsByModule,
  selectedPermissions,
  handlePermissionChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('users.form.userPermissions')}
      </h3>

      {Object.entries(permissionsByModule).map(([module, permissions]) => (
        <div key={module} className="space-y-3">
          <h4 className="font-medium text-gray-900 border-b pb-2">{module}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {selectedPermissions.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          {t('users.form.noPermissionsSelected')}
        </p>
      )}
    </div>
  );
};

export default UserPermissionsForm;