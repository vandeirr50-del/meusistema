import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Terminal } from 'lucide-react';

interface MT5ConnectionStatusProps {
  connected: boolean;
  loading: boolean;
  onRefresh: () => void;
  backendAvailable?: boolean;
}

const MT5ConnectionStatus: React.FC<MT5ConnectionStatusProps> = ({
  connected,
  loading,
  onRefresh,
  backendAvailable = false
}) => {
  const getStatusInfo = () => {
    if (!backendAvailable) {
      return {
        icon: <Terminal className="w-5 h-5 text-orange-600" />,
        title: 'Backend Desconectado',
        subtitle: 'Servidor Python não está rodando',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
      };
    }
    
    if (connected) {
      return {
        icon: <Wifi className="w-5 h-5 text-green-600" />,
        title: 'MT5 Conectado',
        subtitle: 'Dados em tempo real',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
      };
    }
    
    return {
      icon: <WifiOff className="w-5 h-5 text-red-600" />,
      title: 'MT5 Desconectado',
      subtitle: 'Usando dados simulados',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${status.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {status.icon}
          <div>
            <h3 className="font-semibold text-gray-900">{status.title}</h3>
            <p className={`text-sm ${status.color}`}>
              {status.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!backendAvailable ? (
            <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800 font-medium">
                Execute: python app.py
              </span>
            </div>
          ) : !connected ? (
            <button
              onClick={onRefresh} // Agora o botão de conectar apenas atualiza
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {loading ? 'Tentando...' : 'Tentar Reconectar'}
            </button>
          ) : null}
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-white bg-opacity-50 text-gray-600 rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MT5ConnectionStatus;
