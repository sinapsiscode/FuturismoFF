export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  REFUNDED: 'refunded'
};

export const DOCUMENT_TYPES = {
  DNI: 'dni',
  PASSPORT: 'passport',
  RUC: 'ruc',
  CE: 'ce'
};

export const RESERVATION_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  RATE: 'rate',
  DUPLICATE: 'duplicate'
};

export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv'
};

export const TOUR_TYPES = {
  CULTURAL: 'cultural',
  GASTRONOMIC: 'gastronomic',
  ADVENTURE: 'adventure',
  ECOLOGICAL: 'ecological',
  HISTORICAL: 'historical'
};

export const PASSENGER_TYPES = {
  ADULT: 'adult',
  CHILD: 'child',
  INFANT: 'infant',
  SENIOR: 'senior'
};

export const TIMELINE_INTERVALS = {
  THIRTY_MIN: 30,
  ONE_HOUR: 60,
  TWO_HOURS: 120
};

export const FILTER_OPTIONS = {
  DATE_RANGE: 'dateRange',
  STATUS: 'status',
  CUSTOMER: 'customer',
  PASSENGERS: 'passengers',
  TOUR_TYPE: 'tourType',
  PAYMENT_STATUS: 'paymentStatus'
};

export const SORT_OPTIONS = {
  DATE_ASC: 'dateAsc',
  DATE_DESC: 'dateDesc',
  NAME_ASC: 'nameAsc',
  NAME_DESC: 'nameDesc',
  STATUS: 'status',
  TOTAL: 'total'
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_FILTERS = {
  status: 'all',
  dateFrom: '',
  dateTo: '',
  customer: '',
  minPassengers: '',
  maxPassengers: '',
  tourType: 'all',
  paymentStatus: 'all'
};

export const RATING_ASPECTS = {
  SERVICE: 'service',
  PUNCTUALITY: 'punctuality',
  QUALITY: 'quality',
  VALUE: 'value',
  GUIDE: 'guide'
};