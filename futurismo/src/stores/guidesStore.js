import { create } from 'zustand';

// Catálogo de idiomas disponibles
const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'Inglés', flag: '🇺🇸' },
  { code: 'fr', name: 'Francés', flag: '🇫🇷' },
  { code: 'de', name: 'Alemán', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
  { code: 'ja', name: 'Japonés', flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'zh', name: 'Chino Mandarín', flag: '🇨🇳' },
  { code: 'ru', name: 'Ruso', flag: '🇷🇺' }
];

// Datos mock de guías
const mockGuides = [
  {
    id: 'guide001',
    fullName: 'María Elena Torres Vásquez',
    dni: '12345678',
    phone: '+51 987 654 321',
    email: 'maria.torres@futurismo.com',
    address: 'Av. Grau 123, Miraflores, Lima',
    guideType: 'freelance',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'avanzado' },
        { code: 'fr', level: 'intermedio' }
      ],
      museums: [
        { name: 'Museo Larco', expertise: 'experto' },
        { name: 'Museo del Oro', expertise: 'avanzado' },
        { name: 'Museo Nacional de Antropología', expertise: 'intermedio' }
      ]
    },
    stats: {
      toursCompleted: 156,
      yearsExperience: 5,
      rating: 4.8,
      certifications: 3
    },
    status: 'active',
    createdAt: '2019-03-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'guide002',
    fullName: 'Carlos Alberto Mendoza Silva',
    dni: '87654321',
    phone: '+51 987 654 322',
    email: 'carlos.mendoza@futurismo.com',
    address: 'Jr. Lima 456, San Isidro, Lima',
    guideType: 'planta',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'experto' },
        { code: 'de', level: 'avanzado' }
      ],
      museums: [
        { name: 'Museo de Arte de Lima', expertise: 'experto' },
        { name: 'Museo Pedro de Osma', expertise: 'avanzado' }
      ]
    },
    stats: {
      toursCompleted: 234,
      yearsExperience: 8,
      rating: 4.9,
      certifications: 5
    },
    status: 'active',
    createdAt: '2016-08-20T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'guide003',
    fullName: 'Ana Sofía Quispe Mamani',
    dni: '11223344',
    phone: '+51 987 654 323',
    email: 'ana.quispe@futurismo.com',
    address: 'Av. Arequipa 789, Lince, Lima',
    guideType: 'freelance',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'intermedio' },
        { code: 'ja', level: 'avanzado' }
      ],
      museums: [
        { name: 'Museo de la Nación', expertise: 'experto' },
        { name: 'Museo de Sitio Pachacamac', expertise: 'intermedio' }
      ]
    },
    stats: {
      toursCompleted: 89,
      yearsExperience: 3,
      rating: 4.6,
      certifications: 2
    },
    status: 'active',
    createdAt: '2021-06-10T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];

const useGuidesStore = create((set, get) => ({
  // Estado
  guides: mockGuides,
  languages: languages,
  museums: [], // Ya no necesitamos un catálogo fijo de museos
  
  // Funciones principales (acceso directo)
  getGuides: (filters = {}) => {
    const { guides } = get();
    
    if (!filters || Object.keys(filters).length === 0) {
      return guides;
    }
    
    return guides.filter(guide => {
      // Filtro por tipo
      if (filters.tipo && guide.guideType !== filters.tipo) {
        return false;
      }
      
      // Filtro por idioma
      if (filters.language && !guide.specializations.languages.some(lang => lang.code === filters.language)) {
        return false;
      }
      
      // Filtro por museo
      if (filters.museum && !guide.specializations.museums.some(museum => 
        museum.name.toLowerCase().includes(filters.museum.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  },

  getGuideAgenda: (guideId, date) => {
    // Mock agenda data
    return {
      guideId,
      date: date,
      slots: [
        { time: '09:00', status: 'available' },
        { time: '10:00', status: 'busy', tour: 'City Tour Lima' },
        { time: '11:00', status: 'busy', tour: 'City Tour Lima' },
        { time: '12:00', status: 'available' },
        { time: '13:00', status: 'break' },
        { time: '14:00', status: 'available' },
        { time: '15:00', status: 'available' },
        { time: '16:00', status: 'busy', tour: 'Museo Larco' },
        { time: '17:00', status: 'available' }
      ]
    };
  },
  
  // Acciones
  actions: {
    // Agregar nuevo guía
    addGuide: (guideData) => {
      const newGuide = {
        id: `guide${Date.now()}`,
        ...guideData,
        stats: {
          toursCompleted: 0,
          yearsExperience: 0,
          rating: 0,
          certifications: 0
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set((state) => ({
        guides: [...state.guides, newGuide]
      }));
      
      return newGuide;
    },

    // Actualizar guía existente
    updateGuide: (guideId, updateData) => {
      set((state) => ({
        guides: state.guides.map(guide =>
          guide.id === guideId
            ? { ...guide, ...updateData, updatedAt: new Date().toISOString() }
            : guide
        )
      }));
    },

    // Eliminar guía
    deleteGuide: (guideId) => {
      set((state) => ({
        guides: state.guides.filter(guide => guide.id !== guideId)
      }));
    },

    // Obtener guía por ID
    getGuideById: (guideId) => {
      const { guides } = get();
      return guides.find(guide => guide.id === guideId);
    },

    // Filtrar guías
    filterGuides: (filters) => {
      const { guides } = get();
      
      return guides.filter(guide => {
        // Filtro por tipo
        if (filters.type && guide.guideType !== filters.type) {
          return false;
        }
        
        // Filtro por idioma
        if (filters.language && !guide.specializations.languages.some(lang => lang.code === filters.language)) {
          return false;
        }
        
        // Filtro por museo (buscar en el nombre)
        if (filters.museum && !guide.specializations.museums.some(museum => 
          museum.name.toLowerCase().includes(filters.museum.toLowerCase())
        )) {
          return false;
        }
        
        // Filtro por texto de búsqueda
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return guide.fullName.toLowerCase().includes(searchTerm) ||
                 guide.email.toLowerCase().includes(searchTerm) ||
                 guide.dni.includes(searchTerm);
        }
        
        return true;
      });
    },

    // Obtener estadísticas
    getStatistics: () => {
      const { guides } = get();
      
      return {
        total: guides.length,
        planta: guides.filter(g => g.guideType === 'planta').length,
        freelance: guides.filter(g => g.guideType === 'freelance').length,
        active: guides.filter(g => g.status === 'active').length
      };
    }
  }
}));

export { useGuidesStore };
export default useGuidesStore;