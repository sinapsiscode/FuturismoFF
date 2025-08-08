import { useEffect, useRef } from 'react';
import L from 'leaflet';
import useLeafletMap from '../../hooks/useLeafletMap';
import styles from '../../styles/layout.module.css';

const MapContainer = ({ onMapReady }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Usar el hook para manejar el responsive del mapa
  const { getMapContainerStyle, toggleFullscreen, isFullscreen } = useLeafletMap(
    mapInstanceRef.current,
    {
      maintainView: true,
      mobileHeight: 'calc(100vh - 8rem)' // Ajustar para móvil si necesario
    }
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializar el mapa
    const map = L.map(mapRef.current, {
      center: [-12.0464, -77.0428], // Lima, Perú
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    // Agregar capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Guardar referencia
    mapInstanceRef.current = map;

    // Notificar que el mapa está listo
    if (onMapReady) {
      onMapReady(map);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  return (
    <div className={styles.mapContainer} style={getMapContainerStyle()}>
      <div ref={mapRef} className={styles.leafletMap} />
      
      {/* Controles adicionales */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleFullscreen}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? '⛶' : '⛶'}
        </button>
      </div>
    </div>
  );
};

export default MapContainer;