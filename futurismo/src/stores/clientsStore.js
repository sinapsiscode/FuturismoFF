import { create } from 'zustand';
import { clientsService } from '../services/clientsService';

const useClientsStore = create((set, get) => ({
  // Estado
  clients: [],
  types: [],
  selectedClient: null,
  filters: {
    type: '',
    status: '',
    search: '',
    minRating: 0,
    sortBy: 'recent'
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
      // Cargar tipos de cliente
      const typesResult = await clientsService.getClientTypes();
      if (!typesResult.success) {
        throw new Error(typesResult.error || 'Error al cargar tipos de cliente');
      }
      
      // Cargar clientes iniciales
      const clientsResult = await clientsService.getClients({ page: 1, limit: 10 });
      if (!clientsResult.success) {
        throw new Error(clientsResult.error || 'Error al cargar clientes');
      }
      
      set({
        types: typesResult.data,
        clients: clientsResult.data,
        pagination: clientsResult.pagination,
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

  // Cargar clientes con filtros
  loadClients: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, pagination } = get();
      const combinedFilters = {
        ...filters,
        ...customFilters,
        page: customFilters.page || pagination.page,
        limit: customFilters.limit || pagination.limit
      };
      
      const result = await clientsService.getClients(combinedFilters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar clientes');
      }
      
      set({
        clients: result.data,
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

  // Obtener cliente por ID
  getClientById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.getClientById(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar cliente');
      }
      
      set({
        selectedClient: result.data,
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

  // Crear nuevo cliente
  createClient: async (clientData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.createClient(clientData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear cliente');
      }
      
      // Recargar clientes
      await get().loadClients();
      
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

  // Actualizar cliente
  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.updateClient(id, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar cliente');
      }
      
      set((state) => ({
        clients: state.clients.map(client =>
          client.id === id ? result.data : client
        ),
        selectedClient: state.selectedClient?.id === id ? result.data : state.selectedClient,
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

  // Eliminar cliente
  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.deleteClient(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar cliente');
      }
      
      set((state) => ({
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
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

  // Cambiar estado del cliente
  toggleClientStatus: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.toggleClientStatus(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cambiar estado del cliente');
      }
      
      set((state) => ({
        clients: state.clients.map(client =>
          client.id === id ? result.data : client
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

  // Obtener reservas del cliente
  getClientBookings: async (clientId, filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.getClientBookings(clientId, filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar reservas del cliente');
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

  // Actualizar crédito del cliente
  updateClientCredit: async (id, creditData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.updateClientCredit(id, creditData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar crédito');
      }
      
      set((state) => ({
        clients: state.clients.map(client =>
          client.id === id ? result.data : client
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

  // Establecer filtros
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset página al cambiar filtros
    }));
    
    // Cargar clientes con nuevos filtros
    get().loadClients();
  },

  // Limpiar filtros
  clearFilters: () => {
    set({
      filters: {
        type: '',
        status: '',
        search: '',
        minRating: 0,
        sortBy: 'recent'
      },
      pagination: { ...get().pagination, page: 1 }
    });
    
    // Cargar clientes sin filtros
    get().loadClients();
  },

  // Cambiar página
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    
    get().loadClients();
  },

  // Buscar clientes
  searchClients: async (searchTerm) => {
    set({ 
      filters: { ...get().filters, search: searchTerm },
      pagination: { ...get().pagination, page: 1 }
    });
    
    return get().loadClients();
  },

  // Obtener estadísticas
  getStatistics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.getStatistics();
      
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

  // Obtener clientes por tipo
  getClientsByType: (type) => {
    const { clients } = get();
    return clients.filter(client => client.type === type);
  },

  // Obtener clientes activos
  getActiveClients: () => {
    const { clients } = get();
    return clients.filter(client => client.status === 'activo');
  },

  // Obtener agencias con crédito
  getAgenciesWithCredit: () => {
    const { clients } = get();
    return clients.filter(client => 
      client.type === 'agency' && 
      client.creditLimit && 
      client.creditLimit > 0
    );
  },

  // Validar RUC
  validateRUC: async (ruc) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.validateRUC(ruc);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al validar RUC');
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

  // Fusionar clientes
  mergeClients: async (primaryId, secondaryId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await clientsService.mergeClients(primaryId, secondaryId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al fusionar clientes');
      }
      
      // Recargar clientes
      await get().loadClients();
      
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

  // Seleccionar cliente
  selectClient: (client) => set({ selectedClient: client }),

  // Limpiar cliente seleccionado
  clearSelectedClient: () => set({ selectedClient: null }),

  // Establecer estado de carga
  setLoading: (isLoading) => set({ isLoading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar error
  clearError: () => set({ error: null }),

  // Limpiar store
  clearStore: () => {
    set({
      clients: [],
      types: [],
      selectedClient: null,
      filters: {
        type: '',
        status: '',
        search: '',
        minRating: 0,
        sortBy: 'recent'
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

export { useClientsStore };
export default useClientsStore;