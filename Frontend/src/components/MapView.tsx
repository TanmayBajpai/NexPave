// MapView.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, IconOptions } from 'leaflet';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

// Fix default marker icon paths in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Utility to create colored marker icons
const createCustomIcon = (color: string): Icon => {
  const options: IconOptions = {
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  };
  return new Icon(options);
};

const lowSeverityIcon = createCustomIcon('green');
const mediumSeverityIcon = createCustomIcon('orange');
const highSeverityIcon = createCustomIcon('red');

export interface PotholeMarker {
  id: string;
  position: [number, number];
  severity: 'low' | 'medium' | 'high';
  reportDate: string;
  status: 'reported' | 'verified' | 'in_progress' | 'completed';
  bounty: number;
}

interface MapViewProps {
  markers: PotholeMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
                                           markers,
                                           center = [20.5937, 78.9629], // Center of India
                                           zoom = 5,
                                           onMarkerClick,
                                         }) => {
  const getSeverityIcon = (severity: PotholeMarker['severity']) => {
    switch (severity) {
      case 'high':
        return highSeverityIcon;
      case 'medium':
        return mediumSeverityIcon;
      case 'low':
      default:
        return lowSeverityIcon;
    }
  };

  const getSeverityBadge = (severity: PotholeMarker['severity']) => {
    switch (severity) {
      case 'high':
        return (
            <span className="badge badge-severe flex items-center">
            <AlertOctagon size={12} className="mr-1" /> Severe
          </span>
        );
      case 'medium':
        return (
            <span className="badge badge-moderate flex items-center">
            <AlertTriangle size={12} className="mr-1" /> Moderate
          </span>
        );
      case 'low':
      default:
        return (
            <span className="badge badge-minor flex items-center">
            <AlertCircle size={12} className="mr-1" /> Minor
          </span>
        );
    }
  };

  const getStatusBadge = (status: PotholeMarker['status']) => {
    switch (status) {
      case 'reported':
        return <span className="badge bg-blue-100 text-blue-700">Reported</span>;
      case 'verified':
        return <span className="badge bg-purple-100 text-purple-700">Verified</span>;
      case 'in_progress':
        return <span className="badge bg-yellow-100 text-yellow-700">In Progress</span>;
      case 'completed':
        return <span className="badge bg-green-100 text-green-700">Completed</span>;
      default:
        return null;
    }
  };

  return (
      <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map(marker => (
            <Marker
                key={marker.id}
                position={marker.position}
                icon={getSeverityIcon(marker.severity)}
                eventHandlers={{ click: () => onMarkerClick?.(marker.id) }}
            >
              <Popup>
                <div className="p-1">
                  <div className="flex justify-between items-center mb-2">
                    {getSeverityBadge(marker.severity)}
                    {getStatusBadge(marker.status)}
                  </div>
                  <p className="text-sm mb-1">Reported: {marker.reportDate}</p>
                  <p className="text-sm font-semibold">Bounty: ₹{marker.bounty.toFixed(2)}</p>
                  <button
                      className="mt-3 text-xs font-medium text-primary-600 hover:text-primary-800"
                      onClick={() => onMarkerClick?.(marker.id)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
  );
};

export default MapView;

  
