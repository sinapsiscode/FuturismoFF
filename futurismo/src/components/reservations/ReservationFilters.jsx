import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { RESERVATION_STATUS_SPANISH } from '../../constants/reservationConstants';

const ReservationFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  customerFilter,
  setCustomerFilter,
  minPassengers,
  setMinPassengers,
  maxPassengers,
  setMaxPassengers,
  resetFilters,
  hasActiveFilters
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('search.searchByTour')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filtros avanzados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('reservations.status')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('common.all')}</option>
            {Object.values(RESERVATION_STATUS_SPANISH).map(status => (
              <option key={status} value={status}>
                {t(`reservations.${status}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.dateFrom')}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.dateTo')}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.customer')}
          </label>
          <input
            type="text"
            placeholder={t('common.customerName')}
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Mínimo pasajeros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('reservations.minPassengers')}
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            value={minPassengers}
            onChange={(e) => setMinPassengers(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Máximo pasajeros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('reservations.maxPassengers')}
          </label>
          <input
            type="number"
            min="1"
            placeholder="50"
            value={maxPassengers}
            onChange={(e) => setMaxPassengers(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              {t('common.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationFilters;