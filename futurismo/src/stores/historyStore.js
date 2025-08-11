import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      // Estado del historial
      services: [],
      filteredServices: [],
      loading: false,
      error: null,
      
      // Filtros
      filters: {
        dateRange: 'all', // all, today, week, month, year
        status: 'all', // all, completed, cancelled, pending
        serviceType: 'all', // all, regular, private, transfer
        search: '',
        guide: 'all',
        driver: 'all',
        vehicle: 'all'
      },

      // Paginación
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
      },

      // Ordenamiento
      sort: {
        field: 'date',
        direction: 'desc' // asc, desc
      },

      // Cargar servicios del historial
      loadHistory: async () => {
        set({ loading: true, error: null });
        try {
          // Simular carga de datos - en producción vendría de la API
          const mockHistoryData = generateMockHistoryData();
          const totalItems = mockHistoryData.length;
          const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage);
          
          set({ 
            services: mockHistoryData,
            filteredServices: mockHistoryData,
            loading: false,
            pagination: {
              ...get().pagination,
              totalItems,
              totalPages
            }
          });
        } catch (error) {
          set({ 
            error: error.message, 
            loading: false 
          });
        }
      },

      // Aplicar filtros
      applyFilters: () => {
        const { services, filters, sort } = get();
        let filtered = [...services];

        // Filtro por búsqueda
        if (filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(service => 
            service.serviceName.toLowerCase().includes(searchTerm) ||
            service.clientName.toLowerCase().includes(searchTerm) ||
            service.guide?.toLowerCase().includes(searchTerm) ||
            service.driver?.toLowerCase().includes(searchTerm)
          );
        }

        // Filtro por rango de fechas
        if (filters.dateRange !== 'all') {
          const now = new Date();
          const filterDate = getDateByRange(filters.dateRange, now);
          filtered = filtered.filter(service => 
            new Date(service.date) >= filterDate
          );
        }

        // Filtro por estado
        if (filters.status !== 'all') {
          filtered = filtered.filter(service => service.status === filters.status);
        }

        // Filtro por tipo de servicio
        if (filters.serviceType !== 'all') {
          filtered = filtered.filter(service => service.serviceType === filters.serviceType);
        }

        // Filtro por guía
        if (filters.guide !== 'all') {
          filtered = filtered.filter(service => service.guide === filters.guide);
        }

        // Filtro por chofer
        if (filters.driver !== 'all') {
          filtered = filtered.filter(service => service.driver === filters.driver);
        }

        // Filtro por vehículo
        if (filters.vehicle !== 'all') {
          filtered = filtered.filter(service => service.vehicle === filters.vehicle);
        }

        // Ordenamiento
        filtered.sort((a, b) => {
          const { field, direction } = sort;
          let aVal = a[field];
          let bVal = b[field];

          // Conversión especial para fechas
          if (field === 'date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }

          if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });

        // Actualizar paginación
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage);

        set({ 
          filteredServices: filtered,
          pagination: {
            ...get().pagination,
            totalItems,
            totalPages
          }
        });
      },

      // Actualizar filtros
      updateFilter: (filterName, value) => {
        set(state => ({
          filters: {
            ...state.filters,
            [filterName]: value
          },
          pagination: {
            ...state.pagination,
            currentPage: 1 // Reset to first page when filtering
          }
        }));
        // Use setTimeout to prevent immediate re-render loops
        setTimeout(() => {
          get().applyFilters();
        }, 0);
      },

      // Limpiar filtros
      clearFilters: () => {
        set({
          filters: {
            dateRange: 'all',
            status: 'all',
            serviceType: 'all',
            search: '',
            guide: 'all',
            driver: 'all',
            vehicle: 'all'
          },
          pagination: {
            ...get().pagination,
            currentPage: 1
          }
        });
        setTimeout(() => {
          get().applyFilters();
        }, 0);
      },

      // Cambiar página
      changePage: (page) => {
        set(state => ({
          pagination: {
            ...state.pagination,
            currentPage: page
          }
        }));
      },

      // Cambiar ordenamiento
      updateSort: (field) => {
        const currentSort = get().sort;
        const newDirection = currentSort.field === field && currentSort.direction === 'desc' 
          ? 'asc' 
          : 'desc';
        
        set({
          sort: {
            field,
            direction: newDirection
          }
        });
        setTimeout(() => {
          get().applyFilters();
        }, 0);
      },

      // Obtener servicios paginados
      getPaginatedServices: () => {
        const { filteredServices, pagination } = get();
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return filteredServices.slice(startIndex, endIndex);
      },

      // Obtener opciones únicas para filtros
      getFilterOptions: () => {
        const { services } = get();
        return {
          guides: [...new Set(services.map(s => s.guide).filter(Boolean))],
          drivers: [...new Set(services.map(s => s.driver).filter(Boolean))],
          vehicles: [...new Set(services.map(s => s.vehicle).filter(Boolean))]
        };
      }
    }),
    {
      name: 'history-store',
      partialize: (state) => ({ 
        filters: state.filters,
        pagination: state.pagination,
        sort: state.sort 
      })
    }
  )
);

// Función auxiliar para generar datos mock
function generateMockHistoryData() {
  const services = [];
  const serviceTypes = ['regular', 'private', 'transfer'];
  const statuses = ['completed', 'cancelled', 'pending'];
  const guides = ['Carlos Mendoza', 'Ana García', 'Luis Rodriguez', 'María López'];
  const drivers = ['Pedro Silva', 'Juan Torres', 'Diego Morales', 'Roberto Castro'];
  const vehicles = ['Toyota Hiace - ABC123', 'Mercedes Sprinter - XYZ789', 'Ford Transit - DEF456'];

  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    services.push({
      id: `service-${i + 1}`,
      serviceName: `Servicio ${i + 1}`,
      clientName: `Cliente ${i + 1}`,
      date: date.toISOString(),
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      guide: guides[Math.floor(Math.random() * guides.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      amount: Math.floor(Math.random() * 500) + 100,
      duration: Math.floor(Math.random() * 8) + 2,
      passengers: Math.floor(Math.random() * 10) + 1,
      notes: `Notas para el servicio ${i + 1}`
    });
  }

  return services;
}

// Función auxiliar para obtener fecha por rango
function getDateByRange(range, baseDate) {
  const date = new Date(baseDate);
  
  switch (range) {
    case 'today':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      return new Date(0); // Fecha muy antigua para mostrar todos
  }
  
  return date;
}

export default useHistoryStore;