export const PAYMENT_METHOD_TYPES = {
  BANK_ACCOUNT: 'bank_account',
  CREDIT_CARD: 'credit_card'
};

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CTS: 'cts'
};

export const CURRENCIES = {
  PEN: 'PEN',
  USD: 'USD',
  EUR: 'EUR'
};

export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex'
};

export const DOCUMENT_TYPES = {
  RUC: 'ruc',
  DNI: 'dni',
  LICENSE: 'license',
  CERTIFICATE: 'certificate',
  CONTRACT: 'contract',
  INSURANCE: 'insurance'
};

export const DOCUMENT_STATUS = {
  VALID: 'valid',
  EXPIRED: 'expired',
  PENDING: 'pending',
  REJECTED: 'rejected'
};

export const FEEDBACK_CATEGORIES = {
  SERVICE: 'service',
  GUIDES: 'guides',
  TRANSPORT: 'transport',
  ACCOMMODATION: 'accommodation',
  COMMUNICATION: 'communication',
  OTHER: 'other'
};

export const RATING_LEVELS = {
  EXCELLENT: 5,
  VERY_GOOD: 4,
  GOOD: 3,
  REGULAR: 2,
  BAD: 1
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

export const CONTACT_TYPES = {
  MAIN: 'main',
  BILLING: 'billing',
  EMERGENCY: 'emergency',
  OPERATIONS: 'operations'
};

export const CARD_NUMBER_MASK_PATTERN = /(\d{4})(\d+)(\d{4})/;

export const DATE_FORMATS = {
  EXPIRY: 'MM/YYYY',
  DOCUMENT: 'DD/MM/YYYY'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_FILE_TYPES = {
  documents: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  images: '.jpg,.jpeg,.png,.webp'
};