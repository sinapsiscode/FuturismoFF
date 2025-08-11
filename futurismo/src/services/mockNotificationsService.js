/**
 * Servicio mock de notificaciones
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import { NOTIFICATION_TYPES } from '../utils/constants';

// Base de datos mock de notificaciones
const MOCK_NOTIFICATIONS_DB = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Reserva confirmada',
    message: 'La reserva RES-2024-001 ha sido confirmada exitosamente',
    actionUrl: '/reservations/RES-2024-001',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Hace 30 minutos
    category: 'reservations'
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Nuevo guía disponible',
    message: 'Carlos Mendoza se ha unido al marketplace',
    actionUrl: '/marketplace/guides/guide-123',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
    category: 'marketplace'
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Documento por vencer',
    message: 'El seguro del vehículo VEH-001 vence en 7 días',
    actionUrl: '/fleet/vehicles/VEH-001',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
    category: 'documents'
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Error en pago',
    message: 'No se pudo procesar el pago de la reserva RES-2024-002',
    actionUrl: '/payments/failed/PAY-001',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Hace 2 días
    category: 'payments'
  },
  {
    id: 'notif-005',
    userId: 'user-001',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Reporte mensual disponible',
    message: 'El reporte de marzo 2024 está listo para descargar',
    actionUrl: '/reports/monthly/2024-03',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Hace 3 horas
    category: 'reports'
  }
];

// Configuración de notificaciones por usuario
const MOCK_USER_PREFERENCES = {
  'user-001': {
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    categories: {
      reservations: true,
      marketplace: true,
      documents: true,
      payments: true,
      reports: true,
      system: true
    }
  }
};

// Plantillas de notificación
const NOTIFICATION_TEMPLATES = {
  reservationConfirmed: {
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Reserva confirmada',
    messageTemplate: 'La reserva {code} ha sido confirmada exitosamente',
    category: 'reservations'
  },
  reservationCancelled: {
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Reserva cancelada',
    messageTemplate: 'La reserva {code} ha sido cancelada',
    category: 'reservations'
  },
  paymentReceived: {
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Pago recibido',
    messageTemplate: 'Se recibió el pago de {amount} para la reserva {code}',
    category: 'payments'
  },
  documentExpiring: {
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Documento por vencer',
    messageTemplate: 'El documento {document} vence en {days} días',
    category: 'documents'
  },
  newGuideAvailable: {
    type: NOTIFICATION_TYPES.INFO,
    title: 'Nuevo guía disponible',
    messageTemplate: '{name} está disponible en el marketplace',
    category: 'marketplace'
  },
  systemMaintenance: {
    type: NOTIFICATION_TYPES.INFO,
    title: 'Mantenimiento del sistema',
    messageTemplate: 'Mantenimiento programado el {date} de {startTime} a {endTime}',
    category: 'system'
  }
};

class MockNotificationsService {
  constructor() {
    this.notifications = [...MOCK_NOTIFICATIONS_DB];
    this.userPreferences = { ...MOCK_USER_PREFERENCES };
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_notifications`;
    const prefsKey = `${APP_CONFIG.storage.prefix}mock_notification_prefs`;
    
    const storedNotifications = localStorage.getItem(storageKey);
    const storedPrefs = localStorage.getItem(prefsKey);
    
    if (storedNotifications) {
      try {
        this.notifications = JSON.parse(storedNotifications);
      } catch (error) {
        console.warn('Error loading mock notifications from storage:', error);
      }
    }
    
    if (storedPrefs) {
      try {
        this.userPreferences = JSON.parse(storedPrefs);
      } catch (error) {
        console.warn('Error loading notification preferences from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_notifications`;
    const prefsKey = `${APP_CONFIG.storage.prefix}mock_notification_prefs`;
    
    localStorage.setItem(storageKey, JSON.stringify(this.notifications));
    localStorage.setItem(prefsKey, JSON.stringify(this.userPreferences));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return `notif-${Date.now()}`;
  }

  // Notificaciones
  async getNotifications(userId, filters = {}) {
    await this.simulateDelay();
    
    let filtered = this.notifications.filter(n => n.userId === userId);
    
    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(n => n.category === filters.category);
    }
    
    // Filtrar por estado de lectura
    if (filters.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.read);
    }
    
    // Filtrar por fecha
    if (filters.startDate) {
      filtered = filtered.filter(n => 
        new Date(n.createdAt) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(n => 
        new Date(n.createdAt) <= new Date(filters.endDate)
      );
    }
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    // Calcular contadores
    const unreadCount = this.notifications.filter(n => 
      n.userId === userId && !n.read
    ).length;
    
    return {
      success: true,
      data: {
        notifications: paginatedData,
        total: filtered.length,
        unreadCount,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getNotificationById(id) {
    await this.simulateDelay();
    
    const notification = this.notifications.find(n => n.id === id);
    
    if (!notification) {
      return {
        success: false,
        error: 'Notificación no encontrada'
      };
    }
    
    return {
      success: true,
      data: notification
    };
  }

  async createNotification(notificationData) {
    await this.simulateDelay();
    
    const newNotification = {
      id: this.generateId(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.unshift(newNotification);
    
    // Limitar a las últimas 1000 notificaciones
    if (this.notifications.length > 1000) {
      this.notifications = this.notifications.slice(0, 1000);
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newNotification
    };
  }

  async markAsRead(id) {
    await this.simulateDelay();
    
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Notificación no encontrada'
      };
    }
    
    this.notifications[index].read = true;
    this.notifications[index].readAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.notifications[index]
    };
  }

  async markAllAsRead(userId) {
    await this.simulateDelay();
    
    const now = new Date().toISOString();
    let updatedCount = 0;
    
    this.notifications = this.notifications.map(n => {
      if (n.userId === userId && !n.read) {
        updatedCount++;
        return { ...n, read: true, readAt: now };
      }
      return n;
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: { updatedCount }
    };
  }

  async deleteNotification(id) {
    await this.simulateDelay();
    
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Notificación no encontrada'
      };
    }
    
    this.notifications.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async clearAll(userId) {
    await this.simulateDelay();
    
    const deletedCount = this.notifications.filter(n => n.userId === userId).length;
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    
    this.saveToStorage();
    
    return {
      success: true,
      data: { deletedCount }
    };
  }

  // Preferencias
  async getUserPreferences(userId) {
    await this.simulateDelay();
    
    const preferences = this.userPreferences[userId] || {
      emailNotifications: true,
      pushNotifications: false,
      soundEnabled: true,
      categories: {
        reservations: true,
        marketplace: true,
        documents: true,
        payments: true,
        reports: true,
        system: true
      }
    };
    
    return {
      success: true,
      data: preferences
    };
  }

  async updateUserPreferences(userId, preferences) {
    await this.simulateDelay();
    
    this.userPreferences[userId] = {
      ...this.userPreferences[userId],
      ...preferences,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.userPreferences[userId]
    };
  }

  // Plantillas
  async getNotificationTemplates() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: NOTIFICATION_TEMPLATES
    };
  }

  async createFromTemplate(templateId, params = {}) {
    await this.simulateDelay();
    
    const template = NOTIFICATION_TEMPLATES[templateId];
    
    if (!template) {
      return {
        success: false,
        error: 'Plantilla no encontrada'
      };
    }
    
    // Reemplazar variables en el mensaje
    let message = template.messageTemplate;
    Object.keys(params).forEach(key => {
      if (key !== 'userId') {
        message = message.replace(`{${key}}`, params[key]);
      }
    });
    
    const notificationData = {
      userId: params.userId,
      type: template.type,
      title: template.title,
      message,
      category: template.category,
      actionUrl: params.actionUrl || null
    };
    
    return this.createNotification(notificationData);
  }

  // Estadísticas
  async getNotificationStats(userId) {
    await this.simulateDelay();
    
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    
    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      byType: {},
      byCategory: {},
      last7Days: 0,
      last30Days: 0
    };
    
    // Contar por tipo
    Object.values(NOTIFICATION_TYPES).forEach(type => {
      stats.byType[type] = userNotifications.filter(n => n.type === type).length;
    });
    
    // Contar por categoría
    const categories = ['reservations', 'marketplace', 'documents', 'payments', 'reports', 'system'];
    categories.forEach(cat => {
      stats.byCategory[cat] = userNotifications.filter(n => n.category === cat).length;
    });
    
    // Contar notificaciones recientes
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    stats.last7Days = userNotifications.filter(n => 
      new Date(n.createdAt) >= sevenDaysAgo
    ).length;
    
    stats.last30Days = userNotifications.filter(n => 
      new Date(n.createdAt) >= thirtyDaysAgo
    ).length;
    
    return {
      success: true,
      data: stats
    };
  }

  // Suscripción a notificaciones push
  async subscribeToPush(userId, subscription) {
    await this.simulateDelay();
    
    // En producción, esto guardaría la suscripción push en el servidor
    console.log('[MOCK] Push subscription saved for user:', userId);
    
    return {
      success: true,
      message: 'Suscripción push activada'
    };
  }

  async unsubscribeFromPush(userId) {
    await this.simulateDelay();
    
    // En producción, esto eliminaría la suscripción push del servidor
    console.log('[MOCK] Push subscription removed for user:', userId);
    
    return {
      success: true,
      message: 'Suscripción push desactivada'
    };
  }

  // Envío masivo (admin)
  async sendBulkNotification(notificationData, userIds) {
    await this.simulateDelay(1000);
    
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = {
        id: this.generateId(),
        userId,
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      this.notifications.unshift(notification);
      notifications.push(notification);
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: {
        sent: notifications.length,
        notifications
      }
    };
  }
}

export const mockNotificationsService = new MockNotificationsService();
export default mockNotificationsService;