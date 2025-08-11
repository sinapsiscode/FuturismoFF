import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar directamente las traducciones
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

const detectLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
};

const resources = {
  es: { translation: esTranslations },
  en: { translation: enTranslations }
};

console.log('🌍 Cargando traducciones...');
console.log('📊 Dashboard stats en español:', esTranslations.dashboard?.stats);
console.log('🔑 Clave vsPreviousMonth:', esTranslations.dashboard?.stats?.vsPreviousMonth);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    debug: true // Activar debug para ver qué está pasando
  })
  .then(() => {
    console.log('✅ i18n inicializado correctamente');
    console.log('🏷️ Idioma detectado:', i18n.language);
    console.log('🔍 Probando traducción:', i18n.t('dashboard.stats.vsPreviousMonth'));
  })
  .catch(error => {
    console.error('❌ Error inicializando i18n:', error);
  });

export default i18n;