export const GUIDE_TYPES = {
  planta: 'planta',
  freelance: 'freelance'
};

export const LEVEL_OPTIONS = [
  { value: 'principiante', label: 'guides.levels.beginner' },
  { value: 'intermedio', label: 'guides.levels.intermediate' },
  { value: 'avanzado', label: 'guides.levels.advanced' },
  { value: 'experto', label: 'guides.levels.expert' },
  { value: 'nativo', label: 'guides.levels.native' }
];

export const LEVEL_COLORS = {
  principiante: 'bg-yellow-100 text-yellow-800',
  intermedio: 'bg-blue-100 text-blue-800',
  avanzado: 'bg-green-100 text-green-800',
  experto: 'bg-purple-100 text-purple-800',
  nativo: 'bg-indigo-100 text-indigo-800'
};

export const GUIDE_STATUS = {
  active: 'active',
  inactive: 'inactive'
};

export const FORM_TABS = [
  { id: 'personal', label: 'guides.form.tabs.personal' },
  { id: 'languages', label: 'guides.form.tabs.languages' },
  { id: 'museums', label: 'guides.form.tabs.museums' }
];

export const DNI_REGEX = /^\d{8}$/;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;