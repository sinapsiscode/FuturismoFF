/**
 * Constantes para la gestión de choferes
 */

// Estados del chofer
export const DRIVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  VACATION: 'vacation',
  SUSPENDED: 'suspended',
  SICK_LEAVE: 'sick_leave'
};

// Labels para estados
export const DRIVER_STATUS_LABELS = {
  [DRIVER_STATUS.ACTIVE]: 'Activo',
  [DRIVER_STATUS.INACTIVE]: 'Inactivo',
  [DRIVER_STATUS.VACATION]: 'Vacaciones',
  [DRIVER_STATUS.SUSPENDED]: 'Suspendido',
  [DRIVER_STATUS.SICK_LEAVE]: 'Licencia Médica'
};

// Colores para estados
export const DRIVER_STATUS_COLORS = {
  [DRIVER_STATUS.ACTIVE]: 'green',
  [DRIVER_STATUS.INACTIVE]: 'gray',
  [DRIVER_STATUS.VACATION]: 'blue',
  [DRIVER_STATUS.SUSPENDED]: 'red',
  [DRIVER_STATUS.SICK_LEAVE]: 'yellow'
};

// Categorías de licencia
export const LICENSE_CATEGORIES = {
  A_I: 'A-I',      // Motos
  A_IIA: 'A-IIa',  // Mototaxis
  A_IIB: 'A-IIb',  // Motos
  A_IIIA: 'A-IIIa', // Autos
  A_IIIB: 'A-IIIb', // Camionetas
  A_IIIC: 'A-IIIc', // Autos y camionetas
  B_I: 'B-I',      // Camiones pequeños
  B_IIA: 'B-IIa',  // Buses
  B_IIB: 'B-IIb',  // Buses turísticos
  B_IIC: 'B-IIc'   // Buses interprovinciales
};

// Labels para licencias
export const LICENSE_CATEGORY_LABELS = {
  [LICENSE_CATEGORIES.A_I]: 'A-I - Motocicletas',
  [LICENSE_CATEGORIES.A_IIA]: 'A-IIa - Mototaxis',
  [LICENSE_CATEGORIES.A_IIB]: 'A-IIb - Motocicletas',
  [LICENSE_CATEGORIES.A_IIIA]: 'A-IIIa - Autos particulares',
  [LICENSE_CATEGORIES.A_IIIB]: 'A-IIIb - Camionetas',
  [LICENSE_CATEGORIES.A_IIIC]: 'A-IIIc - Autos y camionetas',
  [LICENSE_CATEGORIES.B_I]: 'B-I - Camiones pequeños',
  [LICENSE_CATEGORIES.B_IIA]: 'B-IIa - Buses',
  [LICENSE_CATEGORIES.B_IIB]: 'B-IIb - Buses turísticos',
  [LICENSE_CATEGORIES.B_IIC]: 'B-IIc - Buses interprovinciales'
};

// Tipos de empleo
export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACTOR: 'contractor',
  TEMPORARY: 'temporary'
};

// Labels para tipos de empleo
export const EMPLOYMENT_TYPE_LABELS = {
  [EMPLOYMENT_TYPES.FULL_TIME]: 'Tiempo Completo',
  [EMPLOYMENT_TYPES.PART_TIME]: 'Tiempo Parcial',
  [EMPLOYMENT_TYPES.CONTRACTOR]: 'Contratista',
  [EMPLOYMENT_TYPES.TEMPORARY]: 'Temporal'
};

// Turnos de trabajo
export const WORK_SHIFTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  NIGHT: 'night',
  FLEXIBLE: 'flexible'
};

// Labels para turnos
export const WORK_SHIFT_LABELS = {
  [WORK_SHIFTS.MORNING]: 'Mañana (6am - 2pm)',
  [WORK_SHIFTS.AFTERNOON]: 'Tarde (2pm - 10pm)',
  [WORK_SHIFTS.NIGHT]: 'Noche (10pm - 6am)',
  [WORK_SHIFTS.FLEXIBLE]: 'Flexible'
};

// Validaciones
export const DRIVER_VALIDATIONS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  LICENSE_LENGTH: 9,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 15,
  DNI_LENGTH: 8,
  EMERGENCY_CONTACT_MIN_LENGTH: 3
};

// Estados de documentos
export const DOCUMENT_STATUS = {
  VALID: 'valid',
  EXPIRING_SOON: 'expiring_soon',
  EXPIRED: 'expired'
};

// Días para alertar antes del vencimiento
export const DOCUMENT_EXPIRY_ALERTS = {
  LICENSE: 30,        // Alertar 30 días antes
  MEDICAL_CERT: 15,   // Alertar 15 días antes
  BACKGROUND_CHECK: 60 // Alertar 60 días antes
};

// Configuración de paginación
export const DRIVERS_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Opciones de ordenamiento
export const DRIVER_SORT_OPTIONS = {
  NAME_ASC: { field: 'name', order: 'asc', label: 'Nombre (A-Z)' },
  NAME_DESC: { field: 'name', order: 'desc', label: 'Nombre (Z-A)' },
  LICENSE_ASC: { field: 'licenseNumber', order: 'asc', label: 'Licencia (A-Z)' },
  HIRE_DATE_DESC: { field: 'hireDate', order: 'desc', label: 'Más recientes' },
  HIRE_DATE_ASC: { field: 'hireDate', order: 'asc', label: 'Más antiguos' }
};

// Mensajes
export const DRIVER_MESSAGES = {
  CREATE_SUCCESS: 'Chofer creado exitosamente',
  UPDATE_SUCCESS: 'Chofer actualizado exitosamente',
  DELETE_SUCCESS: 'Chofer eliminado exitosamente',
  CREATE_ERROR: 'Error al crear chofer',
  UPDATE_ERROR: 'Error al actualizar chofer',
  DELETE_ERROR: 'Error al eliminar chofer',
  FETCH_ERROR: 'Error al cargar choferes',
  DUPLICATE_LICENSE: 'Ya existe un chofer con esa licencia',
  DUPLICATE_DNI: 'Ya existe un chofer con ese DNI',
  LICENSE_EXPIRED: 'La licencia del chofer está vencida',
  ASSIGN_SUCCESS: 'Chofer asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar chofer',
  NOT_AVAILABLE: 'El chofer no está disponible en esa fecha'
};

// Métricas del chofer
export const DRIVER_METRICS = {
  EXCELLENT_RATING: 4.5,
  GOOD_RATING: 4.0,
  REGULAR_RATING: 3.5,
  MAX_DAILY_HOURS: 8,
  MAX_WEEKLY_HOURS: 48
};