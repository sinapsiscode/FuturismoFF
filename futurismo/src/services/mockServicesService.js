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
    code: 'SRV001',
    type: 'city_tour',
    title: 'City Tour Lima Centro Histórico',
    destination: 'Centro Histórico de Lima',
    description: 'Recorrido por los principales atractivos del centro histórico de Lima, incluyendo Plaza de Armas, Catedral, Palacio de Gobierno y Casa de la Literatura.',
    duration: 4,
    maxParticipants: 15,
    language: 'es',
    requiresGuide: true,
    requiresTransport: true,
    basePrice: 45.00,
    includes: 'Transporte, guía certificado, entradas a museos',
    excludes: 'Almuerzo, bebidas, gastos personales',
    notes: 'Disponible todos los días. Punto de encuentro en Plaza San Martín.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'service-002',
    code: 'SRV002',
    type: 'museum_tour',
    title: 'Tour de Museos de Lima',
    destination: 'Museo Nacional y MALI',
    description: 'Visita a los principales museos de Lima: Museo Nacional de Arqueología, Antropología e Historia del Perú y Museo de Arte de Lima.',
    duration: 3,
    maxParticipants: 12,
    language: 'en',
    requiresGuide: true,
    requiresTransport: false,
    basePrice: 35.00,
    includes: 'Guía especializado, entradas a museos',
    excludes: 'Transporte, refrigerios',
    notes: 'Tour ideal para amantes del arte y la historia. Disponible martes a domingo.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'service-003',
    code: 'SRV003',
    type: 'gastronomy_tour',
    title: 'Tour Gastronómico por Miraflores',
    destination: 'Miraflores y Barranco',
    description: 'Experiencia culinaria visitando mercados locales, restaurantes tradicionales y cevicherías emblemáticas.',
    duration: 5,
    maxParticipants: 8,
    language: 'es',
    requiresGuide: true,
    requiresTransport: true,
    basePrice: 120.00,
    includes: 'Transporte, guía gastronómico, degustaciones, almuerzo',
    excludes: 'Bebidas alcohólicas, propinas',
    notes: 'Incluye visita a mercado de Surquillo y 3 restaurantes. No apto para vegetarianos estrictos.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'service-004',
    code: 'SRV004',
    type: 'nature_tour',
    title: 'Tour Ecológico Pantanos de Villa',
    destination: 'Pantanos de Villa',
    description: 'Recorrido por los humedales más importantes de Lima, observación de aves y flora nativa.',
    duration: 3,
    maxParticipants: 20,
    language: 'es',
    requiresGuide: true,
    requiresTransport: true,
    basePrice: 25.00,
    includes: 'Transporte, guía naturalista, entrada al refugio',
    excludes: 'Almuerzo, equipos de observación',
    notes: 'Recomendable llevar ropa cómoda y protector solar. Ideal para familias.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'service-005',
    code: 'SRV005',
    type: 'adventure_tour',
    title: 'Aventura en Pachacamac',
    destination: 'Sitio Arqueológico de Pachacamac',
    description: 'Tour de aventura combinando arqueología y deportes: visita al santuario prehispánico y actividades de sandboarding.',
    duration: 6,
    maxParticipants: 10,
    language: 'es',
    requiresGuide: true,
    requiresTransport: true,
    basePrice: 85.00,
    includes: 'Transporte 4x4, guía especializado, equipos para sandboard, almuerzo',
    excludes: 'Seguro de accidentes, bebidas extras',
    notes: 'Edad mínima 12 años. Se requiere firma de deslinde de responsabilidades.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date().toISOString()
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
    return `SRV${String(number).padStart(3, '0')}`;
  }

  // Obtener todos los servicios
  async getServices(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.services];
    
    // Filtrar por tipo
    if (filters.type || filters.serviceType) {
      const typeFilter = filters.type || filters.serviceType;
      filtered = filtered.filter(s => s.type === typeFilter);
    }
    
    // Filtrar por idioma
    if (filters.language) {
      filtered = filtered.filter(s => s.language === filters.language);
    }
    
    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.code.toLowerCase().includes(searchTerm) ||
        (s.title && s.title.toLowerCase().includes(searchTerm)) ||
        s.destination.toLowerCase().includes(searchTerm) ||
        (s.description && s.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenar por fecha de creación (más reciente primero)
    filtered.sort((a, b) => {
      const dateA = a.createdAt || new Date().toISOString();
      const dateB = b.createdAt || new Date().toISOString();
      return dateB.localeCompare(dateA);
    });
    
    return {
      success: true,
      data: filtered
    };
  }

  // Obtener servicios activos (ahora simplemente devuelve todos los servicios disponibles)
  async getActiveServices(filters = {}) {
    // Como ahora los servicios son plantillas, simplemente devolvemos todos los servicios
    return this.getServices(filters);
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