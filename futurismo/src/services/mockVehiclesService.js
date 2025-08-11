/**
 * Servicio mock para la gestión de vehículos
 */

import { 
  VEHICLE_STATUS, 
  VEHICLE_TYPES,
  FUEL_TYPES,
  VEHICLE_DOCUMENTS,
  VEHICLE_DOCUMENT_STATUS,
  VEHICLE_FEATURES,
  VEHICLE_MESSAGES,
  VEHICLE_CAPACITY
} from '../constants/vehiclesConstants';

// Generador de datos mock
const generateMockVehicles = (count = 25) => {
  const vehicles = [];
  const brands = ['Toyota', 'Nissan', 'Mercedes-Benz', 'Volkswagen', 'Hyundai', 'Kia', 'Chevrolet', 'Ford', 'Mitsubishi', 'Suzuki'];
  const models = {
    'Toyota': ['Hiace', 'Coaster', 'Corolla', 'RAV4', 'Land Cruiser'],
    'Nissan': ['Urvan', 'Civilian', 'Sentra', 'X-Trail', 'Patrol'],
    'Mercedes-Benz': ['Sprinter', 'Vito', 'Marco Polo'],
    'Volkswagen': ['Crafter', 'Transporter', 'Amarok'],
    'Hyundai': ['H1', 'H350', 'Santa Fe', 'Tucson'],
    'Kia': ['Carnival', 'Sportage', 'Sorento'],
    'Chevrolet': ['Express', 'Suburban', 'Tahoe'],
    'Ford': ['Transit', 'Explorer', 'Expedition'],
    'Mitsubishi': ['L300', 'Outlander', 'Montero'],
    'Suzuki': ['APV', 'Grand Vitara', 'Swift']
  };
  
  const colors = ['Blanco', 'Plata', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde'];
  
  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[brand];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    const year = Math.floor(Math.random() * 10) + 2015; // 2015-2024
    
    // Determinar tipo basado en modelo
    let vehicleType = VEHICLE_TYPES.VAN;
    if (model.includes('Coaster') || model.includes('Civilian')) {
      vehicleType = VEHICLE_TYPES.MINIBUS;
    } else if (model.includes('Corolla') || model.includes('Sentra') || model.includes('Swift')) {
      vehicleType = VEHICLE_TYPES.CAR;
    } else if (model.includes('RAV4') || model.includes('X-Trail') || model.includes('Santa Fe') || 
               model.includes('Tucson') || model.includes('Sportage') || model.includes('Sorento') ||
               model.includes('Explorer') || model.includes('Outlander') || model.includes('Grand Vitara')) {
      vehicleType = VEHICLE_TYPES.SUV;
    } else if (model.includes('Amarok') || model.includes('L300')) {
      vehicleType = VEHICLE_TYPES.PICKUP;
    }
    
    // Determinar capacidad basada en tipo
    const capacityRange = VEHICLE_CAPACITY[vehicleType];
    const capacity = Math.floor(Math.random() * (capacityRange.max - capacityRange.min + 1)) + capacityRange.min;
    
    // Generar placas (formato peruano: ABC-123)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const plate = `${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`;
    
    // Generar kilometraje basado en año
    const yearsOld = new Date().getFullYear() - year;
    const baseKm = yearsOld * 30000; // 30,000 km por año promedio
    const mileage = baseKm + Math.floor(Math.random() * 50000);
    
    // Generar fechas de documentos
    const soatExpiry = new Date();
    soatExpiry.setMonth(soatExpiry.getMonth() + Math.floor(Math.random() * 12) - 3);
    
    const technicalExpiry = new Date();
    technicalExpiry.setMonth(technicalExpiry.getMonth() + Math.floor(Math.random() * 12) - 3);
    
    const circulationExpiry = new Date();
    circulationExpiry.setMonth(circulationExpiry.getMonth() + Math.floor(Math.random() * 24) - 6);
    
    const insuranceExpiry = new Date();
    insuranceExpiry.setMonth(insuranceExpiry.getMonth() + Math.floor(Math.random() * 12) - 2);
    
    // Generar características aleatorias
    const allFeatures = Object.keys(VEHICLE_FEATURES);
    const vehicleFeatures = [];
    const featureCount = Math.floor(Math.random() * 6) + 3; // 3-8 características
    
    for (let j = 0; j < featureCount; j++) {
      const randomFeature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
      if (!vehicleFeatures.includes(randomFeature)) {
        vehicleFeatures.push(randomFeature);
      }
    }
    
    const statusOptions = [
      VEHICLE_STATUS.ACTIVE, VEHICLE_STATUS.ACTIVE, VEHICLE_STATUS.ACTIVE,
      VEHICLE_STATUS.MAINTENANCE, VEHICLE_STATUS.INACTIVE
    ];
    
    const fuelOptions = [
      FUEL_TYPES.GASOLINE, FUEL_TYPES.DIESEL, FUEL_TYPES.DIESEL,
      FUEL_TYPES.GAS, FUEL_TYPES.HYBRID
    ];

    vehicles.push({
      id: `VEH${String(i).padStart(3, '0')}`,
      plate: plate,
      brand: brand,
      model: model,
      year: year,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: vehicleType,
      capacity: capacity,
      fuelType: fuelOptions[Math.floor(Math.random() * fuelOptions.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      
      // Información técnica
      vin: `${brand.substring(0, 3).toUpperCase()}${year}${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      engineNumber: `${brand.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000000) + 1000000}`,
      mileage: mileage,
      lastMaintenanceKm: mileage - Math.floor(Math.random() * 5000),
      nextMaintenanceKm: mileage + (5000 - (mileage % 5000)),
      
      // Documentos
      documents: {
        [VEHICLE_DOCUMENTS.SOAT]: {
          number: `SOAT${year}${Math.floor(Math.random() * 900000) + 100000}`,
          expiry: soatExpiry.toISOString(),
          status: getDocumentStatus(soatExpiry)
        },
        [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
          number: `RT${year}${Math.floor(Math.random() * 900000) + 100000}`,
          expiry: technicalExpiry.toISOString(),
          status: getDocumentStatus(technicalExpiry)
        },
        [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: {
          number: `PC${Math.floor(Math.random() * 900000) + 100000}`,
          expiry: circulationExpiry.toISOString(),
          status: getDocumentStatus(circulationExpiry)
        },
        [VEHICLE_DOCUMENTS.INSURANCE]: {
          number: `SEG${year}${Math.floor(Math.random() * 900000) + 100000}`,
          expiry: insuranceExpiry.toISOString(),
          status: getDocumentStatus(insuranceExpiry),
          company: ['Rimac', 'Pacífico', 'La Positiva', 'Mapfre'][Math.floor(Math.random() * 4)]
        }
      },
      
      // Características
      features: vehicleFeatures,
      
      // Propietario/Responsable
      owner: {
        type: Math.random() > 0.3 ? 'company' : 'leasing',
        name: Math.random() > 0.3 ? 'Futurismo Tours S.A.' : 'Leasing Perú S.A.',
        contact: `9${Math.floor(Math.random() * 90000000) + 10000000}`
      },
      
      // Métricas
      metrics: {
        totalTrips: Math.floor(Math.random() * 300) + 50,
        totalKm: mileage,
        fuelEfficiency: (Math.random() * 8 + 8).toFixed(1), // 8-16 km/l
        averageSpeed: Math.floor(Math.random() * 20) + 40, // 40-60 km/h
        maintenanceCost: Math.floor(Math.random() * 800) + 200, // 200-1000 soles/mes
        incidentCount: Math.floor(Math.random() * 3),
        lastIncidentDate: Math.random() > 0.8 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null
      },
      
      // Asignaciones actuales
      currentAssignments: [],
      
      // Historial de mantenimiento (últimos 3)
      maintenanceHistory: generateMaintenanceHistory(mileage, 3),
      
      // Fotos
      photos: {
        exterior: `/api/vehicles/${i}/photos/exterior.jpg`,
        interior: `/api/vehicles/${i}/photos/interior.jpg`,
        documents: `/api/vehicles/${i}/photos/documents.jpg`
      },
      
      notes: '',
      createdAt: new Date(year, 0, 1).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return vehicles;
};

// Helper para generar historial de mantenimiento
function generateMaintenanceHistory(currentKm, count) {
  const history = [];
  const maintenanceTypes = ['Cambio de aceite', 'Revisión general', 'Cambio de filtros', 'Rotación de llantas', 'Revisión de frenos'];
  
  for (let i = 0; i < count; i++) {
    const km = currentKm - (i + 1) * 5000;
    const date = new Date();
    date.setMonth(date.getMonth() - (i + 1) * 2);
    
    history.push({
      id: `MAINT${Date.now() + i}`,
      date: date.toISOString(),
      km: km,
      type: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
      cost: Math.floor(Math.random() * 500) + 100,
      provider: ['Taller Oficial', 'AutoService', 'MecániCar', 'Servitec'][Math.floor(Math.random() * 4)],
      notes: 'Mantenimiento realizado sin novedades'
    });
  }
  
  return history;
}

// Helper para determinar el estado del documento
function getDocumentStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return VEHICLE_DOCUMENT_STATUS.EXPIRED;
  if (daysUntilExpiry <= 30) return VEHICLE_DOCUMENT_STATUS.EXPIRING_SOON;
  return VEHICLE_DOCUMENT_STATUS.VALID;
}

// Estado inicial
let mockVehicles = generateMockVehicles();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockVehiclesService {
  // Obtener todos los vehículos
  async getVehicles(params = {}) {
    await delay(300);
    
    let result = [...mockVehicles];
    
    // Filtrado
    if (params.status) {
      result = result.filter(vehicle => vehicle.status === params.status);
    }
    
    if (params.type) {
      result = result.filter(vehicle => vehicle.type === params.type);
    }
    
    if (params.fuelType) {
      result = result.filter(vehicle => vehicle.fuelType === params.fuelType);
    }
    
    if (params.minCapacity) {
      result = result.filter(vehicle => vehicle.capacity >= params.minCapacity);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.plate.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenamiento
    if (params.sortBy) {
      const { field, order } = params.sortBy;
      result.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'capacity' || field === 'year' || field === 'mileage') {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }
        
        if (order === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    // Paginación
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      success: true,
      data: {
        items: result.slice(startIndex, endIndex),
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages
        }
      }
    };
  }
  
  // Obtener un vehículo por ID
  async getVehicleById(id) {
    await delay(200);
    
    const vehicle = mockVehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    return {
      success: true,
      data: vehicle
    };
  }
  
  // Crear un nuevo vehículo
  async createVehicle(vehicleData) {
    await delay(500);
    
    // Validar placa duplicada
    if (mockVehicles.some(v => v.plate === vehicleData.plate)) {
      return {
        success: false,
        error: VEHICLE_MESSAGES.DUPLICATE_PLATE
      };
    }
    
    const newVehicle = {
      id: `VEH${String(mockVehicles.length + 1).padStart(3, '0')}`,
      ...vehicleData,
      mileage: vehicleData.mileage || 0,
      lastMaintenanceKm: vehicleData.mileage || 0,
      nextMaintenanceKm: (vehicleData.mileage || 0) + 5000,
      documents: vehicleData.documents || {},
      features: vehicleData.features || [],
      metrics: {
        totalTrips: 0,
        totalKm: vehicleData.mileage || 0,
        fuelEfficiency: 0,
        averageSpeed: 0,
        maintenanceCost: 0,
        incidentCount: 0,
        lastIncidentDate: null
      },
      currentAssignments: [],
      maintenanceHistory: [],
      photos: {
        exterior: null,
        interior: null,
        documents: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockVehicles.unshift(newVehicle);
    
    return {
      success: true,
      data: newVehicle,
      message: VEHICLE_MESSAGES.CREATE_SUCCESS
    };
  }
  
  // Actualizar un vehículo
  async updateVehicle(id, vehicleData) {
    await delay(400);
    
    const index = mockVehicles.findIndex(v => v.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    // Validar placa duplicada (excepto el mismo vehículo)
    if (vehicleData.plate && mockVehicles.some(v => v.plate === vehicleData.plate && v.id !== id)) {
      return {
        success: false,
        error: VEHICLE_MESSAGES.DUPLICATE_PLATE
      };
    }
    
    const updatedVehicle = {
      ...mockVehicles[index],
      ...vehicleData,
      updatedAt: new Date().toISOString()
    };
    
    // Actualizar próximo mantenimiento si cambió el kilometraje
    if (vehicleData.mileage) {
      const maintenanceInterval = 5000;
      updatedVehicle.nextMaintenanceKm = Math.ceil(vehicleData.mileage / maintenanceInterval) * maintenanceInterval;
    }
    
    mockVehicles[index] = updatedVehicle;
    
    return {
      success: true,
      data: updatedVehicle,
      message: VEHICLE_MESSAGES.UPDATE_SUCCESS
    };
  }
  
  // Eliminar un vehículo
  async deleteVehicle(id) {
    await delay(300);
    
    const index = mockVehicles.findIndex(v => v.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    // Verificar si tiene asignaciones activas
    if (mockVehicles[index].currentAssignments.length > 0) {
      return {
        success: false,
        error: 'No se puede eliminar un vehículo con asignaciones activas'
      };
    }
    
    mockVehicles.splice(index, 1);
    
    return {
      success: true,
      message: VEHICLE_MESSAGES.DELETE_SUCCESS
    };
  }
  
  // Verificar disponibilidad de un vehículo
  async checkAvailability(vehicleId, date, passengers = 1) {
    await delay(200);
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    // Verificar estado activo
    if (vehicle.status !== VEHICLE_STATUS.ACTIVE) {
      return {
        success: false,
        data: {
          isAvailable: false,
          reason: `El vehículo está ${VEHICLE_STATUS_LABELS[vehicle.status].toLowerCase()}`
        }
      };
    }
    
    // Verificar documentos vigentes
    const expiredDocs = Object.entries(vehicle.documents)
      .filter(([_, doc]) => doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRED)
      .map(([type, _]) => VEHICLE_DOCUMENT_LABELS[type]);
    
    if (expiredDocs.length > 0) {
      return {
        success: false,
        data: {
          isAvailable: false,
          reason: `${VEHICLE_MESSAGES.DOCUMENTS_EXPIRED}: ${expiredDocs.join(', ')}`
        }
      };
    }
    
    // Verificar capacidad
    if (passengers > vehicle.capacity) {
      return {
        success: false,
        data: {
          isAvailable: false,
          reason: VEHICLE_MESSAGES.CAPACITY_EXCEEDED
        }
      };
    }
    
    // Simular verificación de disponibilidad (85% disponible)
    const isAvailable = Math.random() > 0.15;
    
    return {
      success: true,
      data: {
        isAvailable,
        reason: isAvailable ? null : 'El vehículo ya tiene una asignación en esa fecha',
        currentAssignments: vehicle.currentAssignments,
        capacity: vehicle.capacity,
        documentsStatus: vehicle.documents
      }
    };
  }
  
  // Obtener vehículos disponibles para una fecha
  async getAvailableVehicles(date, minCapacity = 1, vehicleType = null) {
    await delay(400);
    
    const availableVehicles = [];
    
    for (const vehicle of mockVehicles) {
      // Solo vehículos activos
      if (vehicle.status !== VEHICLE_STATUS.ACTIVE) continue;
      
      // Con documentos vigentes
      const hasExpiredDocs = Object.values(vehicle.documents)
        .some(doc => doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRED);
      if (hasExpiredDocs) continue;
      
      // Capacidad mínima
      if (vehicle.capacity < minCapacity) continue;
      
      // Tipo específico si se requiere
      if (vehicleType && vehicle.type !== vehicleType) continue;
      
      // Simular disponibilidad
      if (Math.random() > 0.2) {
        availableVehicles.push({
          ...vehicle,
          availability: {
            date,
            isAvailable: true
          }
        });
      }
    }
    
    // Ordenar por capacidad ascendente (más eficiente primero)
    availableVehicles.sort((a, b) => a.capacity - b.capacity);
    
    return {
      success: true,
      data: availableVehicles
    };
  }
  
  // Asignar vehículo a un tour/servicio
  async assignVehicle(vehicleId, assignmentData) {
    await delay(300);
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    // Verificar disponibilidad
    const availabilityCheck = await this.checkAvailability(
      vehicleId, 
      assignmentData.date, 
      assignmentData.passengers
    );
    
    if (!availabilityCheck.data.isAvailable) {
      return {
        success: false,
        error: availabilityCheck.data.reason
      };
    }
    
    // Agregar asignación
    const assignment = {
      id: `ASSIGN${Date.now()}`,
      ...assignmentData,
      assignedAt: new Date().toISOString()
    };
    
    vehicle.currentAssignments.push(assignment);
    
    return {
      success: true,
      data: assignment,
      message: VEHICLE_MESSAGES.ASSIGN_SUCCESS
    };
  }
  
  // Registrar mantenimiento
  async registerMaintenance(vehicleId, maintenanceData) {
    await delay(300);
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    const maintenance = {
      id: `MAINT${Date.now()}`,
      date: new Date().toISOString(),
      ...maintenanceData
    };
    
    vehicle.maintenanceHistory.unshift(maintenance);
    vehicle.lastMaintenanceKm = maintenanceData.km || vehicle.mileage;
    vehicle.nextMaintenanceKm = vehicle.lastMaintenanceKm + 5000;
    
    // Cambiar estado si está en mantenimiento
    if (maintenanceData.setInMaintenance) {
      vehicle.status = VEHICLE_STATUS.MAINTENANCE;
    }
    
    return {
      success: true,
      data: maintenance,
      message: 'Mantenimiento registrado exitosamente'
    };
  }
  
  // Obtener estadísticas de vehículos
  async getVehiclesStatistics() {
    await delay(200);
    
    const stats = {
      total: mockVehicles.length,
      byStatus: {},
      byType: {},
      byFuelType: {},
      documentsExpiring: 0,
      maintenanceRequired: 0,
      averageMileage: 0,
      totalCapacity: 0
    };
    
    let totalMileage = 0;
    
    mockVehicles.forEach(vehicle => {
      // Por estado
      stats.byStatus[vehicle.status] = (stats.byStatus[vehicle.status] || 0) + 1;
      
      // Por tipo
      stats.byType[vehicle.type] = (stats.byType[vehicle.type] || 0) + 1;
      
      // Por combustible
      stats.byFuelType[vehicle.fuelType] = (stats.byFuelType[vehicle.fuelType] || 0) + 1;
      
      // Documentos por vencer
      Object.values(vehicle.documents).forEach(doc => {
        if (doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRING_SOON) {
          stats.documentsExpiring++;
        }
      });
      
      // Mantenimiento requerido
      if (vehicle.mileage >= vehicle.nextMaintenanceKm) {
        stats.maintenanceRequired++;
      }
      
      // Kilometraje total
      totalMileage += vehicle.mileage;
      
      // Capacidad total
      stats.totalCapacity += vehicle.capacity;
    });
    
    stats.averageMileage = Math.floor(totalMileage / mockVehicles.length);
    
    return {
      success: true,
      data: stats
    };
  }
  
  // Obtener vehículos que requieren mantenimiento
  async getMaintenanceRequired() {
    await delay(300);
    
    const vehiclesNeedingMaintenance = mockVehicles.filter(vehicle => {
      return vehicle.mileage >= vehicle.nextMaintenanceKm ||
             Object.values(vehicle.documents).some(doc => 
               doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRING_SOON ||
               doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRED
             );
    });
    
    return {
      success: true,
      data: vehiclesNeedingMaintenance
    };
  }
}

export default new MockVehiclesService();