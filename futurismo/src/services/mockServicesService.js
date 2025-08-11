/**
 * Servicio mock de servicios turísticos
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import { SERVICE_STATUS } from '../utils/constants';

// Base de datos mock de servicios turísticos
const MOCK_SERVICES_DB = [
  {
    id: 'service-001',
    code: 'TUR001',
    type: 'city_tour',
    status: SERVICE_STATUS.IN_SERVICE,
    client: { 
      id: 'client-001',
      name: 'María González', 
      phone: '+51 987654321',
      email: 'maria.gonzalez@email.com'
    },
    guide: { 
      id: 'guide-001',
      name: 'Carlos Mendoza', 
      phone: '+51 123456789',
      photoUrl: '/avatars/guide1.jpg'
    },
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '13:00',
    pickupLocation: 'Plaza de Armas',
    pickupCoordinates: { lat: -12.0464, lng: -77.0428 },
    destination: 'Circuito Mágico del Agua',
    destinationCoordinates: { lat: -12.0711, lng: -77.0369 },
    currentLocation: { lat: -12.0564, lng: -77.0398 },
    guideLocation: { lat: -12.0564, lng: -77.0398 },
    participants: 4,
    price: 150,
    notes: 'Cliente solicita parada para fotos en el parque Kennedy',
    lastUpdate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'service-002',
    code: 'TUR002',
    type: 'museum_tour',
    status: SERVICE_STATUS.PENDING,
    client: { 
      id: 'client-002',
      name: 'John Smith', 
      phone: '+1 555-0123',
      email: 'john.smith@email.com'
    },
    guide: { 
      id: 'guide-002',
      name: 'Ana Rivera', 
      phone: '+51 987654321',
      photoUrl: '/avatars/guide2.jpg'
    },
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    pickupLocation: 'Hotel Miraflores',
    pickupCoordinates: { lat: -12.1215, lng: -77.0298 },
    destination: 'Museo Nacional',
    destinationCoordinates: { lat: -12.0814, lng: -77.0037 },
    currentLocation: null,
    guideLocation: { lat: -12.1215, lng: -77.0298 },
    participants: 2,
    price: 80,
    notes: 'Tour en inglés',
    lastUpdate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'service-003',
    code: 'TUR003',
    type: 'historical_tour',
    status: SERVICE_STATUS.ON_WAY,
    client: { 
      id: 'client-003',
      name: 'Sophie Dubois', 
      phone: '+33 123456789',
      email: 'sophie.dubois@email.com'
    },
    guide: { 
      id: 'guide-003',
      name: 'Miguel Torres', 
      phone: '+51 876543210',
      photoUrl: '/avatars/guide3.jpg'
    },
    date: new Date().toISOString().split('T')[0],
    startTime: '11:30',
    endTime: '15:30',
    pickupLocation: 'Barranco',
    pickupCoordinates: { lat: -12.1533, lng: -77.0244 },
    destination: 'Centro Histórico',
    destinationCoordinates: { lat: -12.0464, lng: -77.0428 },
    currentLocation: { lat: -12.1033, lng: -77.0344 },
    guideLocation: { lat: -12.1033, lng: -77.0344 },
    participants: 6,
    price: 200,
    notes: 'Incluye almuerzo en restaurante típico',
    lastUpdate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'service-004',
    code: 'TUR004',
    type: 'gastronomy_tour',
    status: SERVICE_STATUS.PAUSED,
    client: { 
      id: 'client-004',
      name: 'Roberto Silva', 
      phone: '+51 555-9876',
      email: 'roberto.silva@email.com'
    },
    guide: { 
      id: 'guide-004',
      name: 'Lucia Fernandez', 
      phone: '+51 765432109',
      photoUrl: '/avatars/guide4.jpg'
    },
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '19:00',
    pickupLocation: 'San Isidro',
    pickupCoordinates: { lat: -12.0956, lng: -77.0364 },
    destination: 'Larco Mar',
    destinationCoordinates: { lat: -12.1319, lng: -77.0305 },
    currentLocation: { lat: -12.1156, lng: -77.0334 },
    guideLocation: { lat: -12.1156, lng: -77.0334 },
    participants: 3,
    price: 120,
    notes: 'Un participante es vegetariano',
    lastUpdate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'service-005',
    code: 'TUR005',
    type: 'adventure_tour',
    status: SERVICE_STATUS.FINISHED,
    client: { 
      id: 'client-005',
      name: 'Emma Johnson', 
      phone: '+44 20 7946 0958',
      email: 'emma.johnson@email.com'
    },
    guide: { 
      id: 'guide-005',
      name: 'Pedro Ramirez', 
      phone: '+51 654321098',
      photoUrl: '/avatars/guide5.jpg'
    },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '18:00',
    pickupLocation: 'Callao',
    pickupCoordinates: { lat: -12.0735, lng: -77.0826 },
    destination: 'Fortaleza del Real Felipe',
    destinationCoordinates: { lat: -12.0620, lng: -77.1470 },
    currentLocation: { lat: -12.0735, lng: -77.0826 },
    guideLocation: { lat: -12.0735, lng: -77.0826 },
    participants: 8,
    price: 300,
    notes: 'Tour completado exitosamente',
    completedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    feedback: 'Excelente servicio, el guía muy profesional',
    lastUpdate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  }
];

// Tipos de servicios
const SERVICE_TYPES = {
  city_tour: 'City Tour',
  museum_tour: 'Tour de Museos',
  historical_tour: 'Tour Histórico',
  gastronomy_tour: 'Tour Gastronómico',
  adventure_tour: 'Tour de Aventura',
  cultural_tour: 'Tour Cultural',
  nature_tour: 'Tour de Naturaleza'
};

class MockServicesService {
  constructor() {
    this.services = [...MOCK_SERVICES_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_services`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        this.services = JSON.parse(stored);
      } catch (error) {
        console.warn('Error loading mock services from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_services`;
    localStorage.setItem(storageKey, JSON.stringify(this.services));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return `service-${Date.now()}`;
  }

  generateCode() {
    const number = this.services.length + 1;
    return `TUR${String(number).padStart(3, '0')}`;
  }

  // Obtener todos los servicios
  async getServices(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.services];
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    // Filtrar por fecha
    if (filters.date) {
      filtered = filtered.filter(s => s.date === filters.date);
    }
    
    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(s => s.type === filters.type);
    }
    
    // Filtrar por guía
    if (filters.guideId) {
      filtered = filtered.filter(s => s.guide.id === filters.guideId);
    }
    
    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.code.toLowerCase().includes(searchTerm) ||
        s.client.name.toLowerCase().includes(searchTerm) ||
        s.guide.name.toLowerCase().includes(searchTerm) ||
        s.destination.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenar por fecha y hora
    filtered.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
    
    return {
      success: true,
      data: filtered
    };
  }

  // Obtener servicios activos
  async getActiveServices(filters = {}) {
    const activeStatuses = [
      SERVICE_STATUS.PENDING,
      SERVICE_STATUS.ON_WAY,
      SERVICE_STATUS.IN_SERVICE,
      SERVICE_STATUS.PAUSED
    ];
    
    const result = await this.getServices({
      ...filters,
      status: filters.status || activeStatuses
    });
    
    if (!result.success) return result;
    
    // Filtrar solo servicios activos si no se especificó estado
    if (!filters.status) {
      result.data = result.data.filter(s => activeStatuses.includes(s.status));
    }
    
    return result;
  }

  // Obtener servicio por ID
  async getServiceById(id) {
    await this.simulateDelay();
    
    const service = this.services.find(s => s.id === id);
    
    if (!service) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    return {
      success: true,
      data: service
    };
  }

  // Crear nuevo servicio
  async createService(serviceData) {
    await this.simulateDelay();
    
    const newService = {
      id: this.generateId(),
      code: this.generateCode(),
      ...serviceData,
      status: SERVICE_STATUS.PENDING,
      currentLocation: null,
      guideLocation: null,
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.services.push(newService);
    this.saveToStorage();
    
    return {
      success: true,
      data: newService
    };
  }

  // Actualizar servicio
  async updateService(id, updateData) {
    await this.simulateDelay();
    
    const index = this.services.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    this.services[index] = {
      ...this.services[index],
      ...updateData,
      lastUpdate: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.services[index]
    };
  }

  // Actualizar estado del servicio
  async updateServiceStatus(id, status) {
    await this.simulateDelay();
    
    const index = this.services.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    const updates = {
      status,
      lastUpdate: new Date().toISOString()
    };
    
    // Si se completa el servicio, agregar timestamp
    if (status === SERVICE_STATUS.FINISHED) {
      updates.completedAt = new Date().toISOString();
    }
    
    this.services[index] = {
      ...this.services[index],
      ...updates
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.services[index]
    };
  }

  // Actualizar ubicación del servicio
  async updateServiceLocation(id, location) {
    await this.simulateDelay();
    
    const index = this.services.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    this.services[index] = {
      ...this.services[index],
      currentLocation: location,
      lastUpdate: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.services[index]
    };
  }

  // Actualizar ubicación del guía
  async updateGuideLocation(guideId, location) {
    await this.simulateDelay();
    
    const updatedServices = [];
    
    this.services = this.services.map(service => {
      if (service.guide.id === guideId && 
          [SERVICE_STATUS.ON_WAY, SERVICE_STATUS.IN_SERVICE].includes(service.status)) {
        const updated = {
          ...service,
          guideLocation: location,
          lastUpdate: new Date().toISOString()
        };
        updatedServices.push(updated);
        return updated;
      }
      return service;
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: updatedServices
    };
  }

  // Eliminar servicio
  async deleteService(id) {
    await this.simulateDelay();
    
    const index = this.services.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    this.services.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // Obtener estadísticas
  async getStatistics(filters = {}) {
    await this.simulateDelay();
    
    let services = [...this.services];
    
    // Aplicar filtros de fecha si existen
    if (filters.startDate && filters.endDate) {
      services = services.filter(s => 
        s.date >= filters.startDate && s.date <= filters.endDate
      );
    }
    
    const stats = {
      total: services.length,
      byStatus: {},
      byType: {},
      revenue: 0,
      averageRating: 0,
      completionRate: 0
    };
    
    // Estadísticas por estado
    Object.values(SERVICE_STATUS).forEach(status => {
      stats.byStatus[status] = services.filter(s => s.status === status).length;
    });
    
    // Estadísticas por tipo
    Object.keys(SERVICE_TYPES).forEach(type => {
      stats.byType[type] = services.filter(s => s.type === type).length;
    });
    
    // Calcular ingresos y rating
    const completedServices = services.filter(s => s.status === SERVICE_STATUS.FINISHED);
    stats.revenue = completedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    
    if (completedServices.length > 0) {
      const totalRating = completedServices.reduce((sum, s) => sum + (s.rating || 0), 0);
      stats.averageRating = totalRating / completedServices.length;
      stats.completionRate = (completedServices.length / services.length) * 100;
    }
    
    return {
      success: true,
      data: stats
    };
  }

  // Agregar calificación y feedback
  async rateService(id, rating, feedback) {
    await this.simulateDelay();
    
    const index = this.services.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Servicio no encontrado'
      };
    }
    
    if (this.services[index].status !== SERVICE_STATUS.FINISHED) {
      return {
        success: false,
        error: 'Solo se pueden calificar servicios completados'
      };
    }
    
    this.services[index] = {
      ...this.services[index],
      rating,
      feedback,
      ratedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.services[index]
    };
  }

  // Obtener tipos de servicio disponibles
  async getServiceTypes() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: Object.entries(SERVICE_TYPES).map(([key, value]) => ({
        id: key,
        name: value
      }))
    };
  }

  // Simular actualización en tiempo real
  startRealtimeUpdates(callback) {
    const interval = setInterval(() => {
      // Simular movimiento de guías en servicios activos
      const activeServices = this.services.filter(s => 
        s.status === SERVICE_STATUS.ON_WAY || s.status === SERVICE_STATUS.IN_SERVICE
      );
      
      activeServices.forEach(service => {
        if (service.guideLocation) {
          // Simular pequeño movimiento
          const newLat = service.guideLocation.lat + (Math.random() - 0.5) * 0.001;
          const newLng = service.guideLocation.lng + (Math.random() - 0.5) * 0.001;
          
          this.updateGuideLocation(service.guide.id, {
            lat: newLat,
            lng: newLng
          });
        }
      });
      
      if (callback) {
        callback(activeServices);
      }
    }, 5000); // Actualizar cada 5 segundos
    
    return interval;
  }

  stopRealtimeUpdates(interval) {
    if (interval) {
      clearInterval(interval);
    }
  }
}

export const mockServicesService = new MockServicesService();
export default mockServicesService;