import React from 'react';
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const RealTimeStatus = ({ isConnected, lastUpdated, onRefresh }) => {
  return (
    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3 text-green-500" />
            <span className="text-green-600">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-yellow-500" />
            <span className="text-yellow-600">Offline</span>
          </>
        )}
        {lastUpdated && (
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>
      {onRefresh && (
        <button 
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-800 text-xs"
        >
          Refresh
        </button>
      )}
    </div>
  );
};

export default RealTimeStatus;