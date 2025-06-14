import React from 'react';
import { Zap, Loader as Road } from 'lucide-react';

interface LogoProps {
  white?: boolean;
}

const Logo: React.FC<LogoProps> = ({ white = false }) => {
  return (
    <div className="relative w-8 h-8">
      <Road 
        size={32} 
        className={`absolute top-0 left-0 ${white ? 'text-white' : 'text-primary-500'}`}
      />
      <Zap 
        size={20} 
        className={`absolute bottom-0 right-0 ${white ? 'text-accent-300' : 'text-accent-500'}`}
      />
    </div>
  );
};

export default Logo;