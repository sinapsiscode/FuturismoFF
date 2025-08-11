import { create } from 'zustand';
import { toursService } from '../services/toursService';

const useToursStore = create((set, get) => ({
  // Estado
  tours: [],
  categories: [],
  selectedTour: null,
  filters: {
    category: '',
    priceRange: null,
    duration: '',
    language: '',
    difficulty: '',
    status: '',
    featured: undefined,
    search: '',
    sortBy: 'popularity'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,
  hasInitialized: false,

  // Acciones
  initialize: async () => {
    const { hasInitialized } = get();
    if (hasInitialized) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Cargar categorías
      const categoriesResult = await toursService.getCategories();
      if (!categoriesResult.success) {
        throw new Error(categoriesResult.error || 'Error al cargar categorías');
      }
      
      // Cargar tours iniciales
      const toursResult = await toursService.getTours({ page: 1, limit: 10 });
      if (!toursResult.success) {
        throw new Error(toursResult.error || 'Error al cargar tours');
      }
      
      set({
        categories: categoriesResult.data,
        tours: toursResult.data,
        pagination: toursResult.pagination,
        isLoading: false,
        hasInitialized: true
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Cargar tours con filtros
  loadTours: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, pagination } = get();
      const combinedFilters = {
        ...filters,
        ...customFilters,
        page: customFilters.page || pagination.page,
        limit: customFilters.limit || pagination.limit
      };
      
      const result = await toursService.getTours(combinedFilters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar tours');
      }
      
      set({
        tours: result.data,
        pagination: result.pagination,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Obtener tour por ID
  getTourById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.getTourById(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar tour');
      }
      
      set({
        selectedTour: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Crear nuevo tour
  createTour: async (tourData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.createTour(tourData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear tour');
      }
      
      // Recargar tours
      await get().loadTours();
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Actualizar tour
  updateTour: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.updateTour(id, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar tour');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === id ? result.data : tour
        ),
        selectedTour: state.selectedTour?.id === id ? result.data : state.selectedTour,
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Eliminar tour
  deleteTour: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.deleteTour(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar tour');
      }
      
      set((state) => ({
        tours: state.tours.filter(tour => tour.id !== id),
        selectedTour: state.selectedTour?.id === id ? null : state.selectedTour,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Cambiar estado del tour
  toggleTourStatus: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.toggleTourStatus(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cambiar estado del tour');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === id ? result.data : tour
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Destacar/Quitar destacado
  toggleTourFeatured: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.toggleTourFeatured(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cambiar destacado del tour');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === id ? result.data : tour
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Duplicar tour
  duplicateTour: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.duplicateTour(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al duplicar tour');
      }
      
      // Recargar tours
      await get().loadTours();
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Establecer filtros
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset página al cambiar filtros
    }));
    
    // Cargar tours con nuevos filtros
    get().loadTours();
  },

  // Limpiar filtros
  clearFilters: () => {
    set({
      filters: {
        category: '',
        priceRange: null,
        duration: '',
        language: '',
        difficulty: '',
        status: '',
        featured: undefined,
        search: '',
        sortBy: 'popularity'
      },
      pagination: { ...get().pagination, page: 1 }
    });
    
    // Cargar tours sin filtros
    get().loadTours();
  },

  // Cambiar página
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    
    get().loadTours();
  },

  // Buscar tours
  searchTours: async (searchTerm) => {
    set({ 
      filters: { ...get().filters, search: searchTerm },
      pagination: { ...get().pagination, page: 1 }
    });
    
    return get().loadTours();
  },

  // Obtener tours disponibles para una fecha
  getAvailableTours: async (date, filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.getAvailableTours(date, filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar tours disponibles');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Obtener estadísticas
  getStatistics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.getStatistics();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Obtener tours por categoría
  getToursByCategory: (category) => {
    const { tours } = get();
    return tours.filter(tour => tour.category === category);
  },

  // Obtener tours destacados
  getFeaturedTours: () => {
    const { tours } = get();
    return tours.filter(tour => tour.featured);
  },

  // Obtener tours activos
  getActiveTours: () => {
    const { tours } = get();
    return tours.filter(tour => tour.status === 'activo');
  },

  // Seleccionar tour
  selectTour: (tour) => set({ selectedTour: tour }),

  // Limpiar tour seleccionado
  clearSelectedTour: () => set({ selectedTour: null }),

  // Asignar guía a tour con validaciones
  assignGuideToTour: async (tourId, guideId, options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // Validar disponibilidad del guía
      const availabilityResult = await toursService.checkGuideAvailability(tourId, guideId);
      
      if (!availabilityResult.success) {
        throw new Error(availabilityResult.error || 'El guía no está disponible para este tour');
      }

      if (!availabilityResult.data.isAvailable) {
        const conflicts = availabilityResult.data.conflicts || [];
        throw new Error(`El guía tiene conflictos de horario: ${conflicts.join(', ')}`);
      }

      // Validar competencias si es necesario
      if (options.validateCompetences) {
        const competenceResult = await toursService.checkGuideCompetences(tourId, guideId);
        
        if (!competenceResult.success || !competenceResult.data.hasRequiredCompetences) {
          throw new Error('El guía no tiene las competencias requeridas para este tour');
        }
      }

      // Asignar el guía
      const result = await toursService.assignGuideToTour(tourId, guideId, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al asignar guía');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === tourId ? result.data : tour
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Asignar tour a agencia
  assignTourToAgency: async (tourId, agencyId, options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.assignTourToAgency(tourId, agencyId, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al asignar tour a agencia');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === tourId ? result.data : tour
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Obtener disponibilidad de guías para un tour
  getAvailableGuidesForTour: async (tourId, date) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.getAvailableGuidesForTour(tourId, date);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener guías disponibles');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Remover asignación
  removeAssignment: async (tourId, assignmentType = 'guide') => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await toursService.removeAssignment(tourId, assignmentType);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al remover asignación');
      }
      
      set((state) => ({
        tours: state.tours.map(tour =>
          tour.id === tourId ? result.data : tour
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Establecer estado de carga
  setLoading: (isLoading) => set({ isLoading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar error
  clearError: () => set({ error: null }),

  // Limpiar store
  clearStore: () => {
    set({
      tours: [],
      categories: [],
      selectedTour: null,
      filters: {
        category: '',
        priceRange: null,
        duration: '',
        language: '',
        difficulty: '',
        status: '',
        featured: undefined,
        search: '',
        sortBy: 'popularity'
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      isLoading: false,
      error: null,
      hasInitialized: false
    });
  }
}));

export { useToursStore };
export default useToursStore;