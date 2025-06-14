import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, MapPin, Calendar, IndianRupee, Check, X, Clock } from 'lucide-react';

interface PotholeCardProps {
  id: string;
  imageUrl: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  reportDate: string;
  status: 'reported' | 'verified' | 'in_progress' | 'completed';
  bounty: number;
  onClick?: () => void;
}

const PotholeCard: React.FC<PotholeCardProps> = ({
  id,
  imageUrl,
  severity,
  location,
  reportDate,
  status,
  bounty,
  onClick
}) => {
  const getSeverityIcon = () => {
    switch (severity) {
      case 'high':
        return <AlertOctagon size={16} className="text-error-500" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-warning-500" />;
      case 'low':
        return <AlertCircle size={16} className="text-success-500" />;
      default:
        return null;
    }
  };

  const getSeverityText = () => {
    switch (severity) {
      case 'high':
        return 'Severe';
      case 'medium':
        return 'Moderate';
      case 'low':
        return 'Minor';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'reported':
        return <AlertTriangle size={16} className="text-blue-500" />;
      case 'verified':
        return <Check size={16} className="text-purple-500" />;
      case 'in_progress':
        return <Clock size={16} className="text-warning-500" />;
      case 'completed':
        return <Check size={16} className="text-success-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'reported':
        return 'Reported';
      case 'verified':
        return 'Verified';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'reported':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'verified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'in_progress':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'completed':
        return 'bg-success-50 text-success-700 border-success-200';
      default:
        return '';
    }
  };

  return (
    <div 
      className="card hover:shadow-lg group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={`Pothole at ${location}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass()}`}>
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          {getSeverityIcon()}
          <span className="ml-1 text-sm font-medium">{getSeverityText()} Damage</span>
          <div className="ml-auto bg-accent-50 text-accent-700 px-2 py-1 rounded-full text-xs font-semibold">
            <div className="flex items-center">
              <IndianRupee size={12} />
              <span>{bounty.toFixed(0)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-500">
          <Calendar size={12} className="mr-1" />
          <span>{reportDate}</span>
        </div>
        <div className="mt-3 text-xs text-neutral-500">ID: {id.slice(0, 8)}...</div>
      </div>
    </div>
  );
};

export default PotholeCard;