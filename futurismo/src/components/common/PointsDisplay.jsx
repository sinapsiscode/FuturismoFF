import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, GiftIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';
import useAgencyStore from '../../stores/agencyStore';

const PointsDisplay = () => {
  const { user } = useAuthStore();
  const { currentAgency, actions } = useAgencyStore();
  
  // Cargar puntos si es agencia
  useEffect(() => {
    if (user?.role === 'agency') {
      actions.fetchPointsBalance();
    }
  }, [user, actions]);

  // Solo mostrar para agencia
  if (!user || user.role !== 'agency') {
    return null;
  }

  // Agency view
  return (
    <div className="flex items-center space-x-2">
      {/* Points balance */}
      <Link
        to="/agency/points"
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <StarIcon className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm font-bold text-gray-900">
            {currentAgency?.pointsBalance?.toLocaleString() || '0'}
          </span>
          <span className="text-xs text-gray-500 ml-1">puntos</span>
        </div>
      </Link>

      {/* Rewards store */}
      <Link
        to="/agency/rewards"
        className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        title="Tienda de Premios"
      >
        <GiftIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default PointsDisplay;