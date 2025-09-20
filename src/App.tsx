import React, { useState } from 'react';
import { BarChart3, TrendingUp, LineChart, GitCompareArrows, Activity, GitMerge } from 'lucide-react';
import IbovPulsePage from './pages/IbovPulsePage';
import DiCurvePage from './pages/DiCurvePage';
import StockAnalysisPage from './pages/StockAnalysisPage';
import CorrelationPage from './pages/CorrelationPage';
import IbovAnalysisPage from './pages/IbovAnalysisPage';
import WinWdoCorrelationPage from './pages/WinWdoCorrelationPage'; // NOVO

type Tab = 'ibov_pulse' | 'di_curve' | 'stock_analysis' | 'correlation' | 'ibov_analysis' | 'win_wdo_correlation';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'ibov_pulse', label: 'Pulso IBOV', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'ibov_analysis', label: 'Análise IBOV', icon: <Activity className="w-5 h-5" /> },
  { id: 'di_curve', label: 'Curva de Juros', icon: <LineChart className="w-5 h-5" /> },
  { id: 'stock_analysis', label: 'Análise de Ativo', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'correlation', label: 'Juros x Futuros', icon: <GitCompareArrows className="w-5 h-5" /> },
  { id: 'win_wdo_correlation', label: 'WIN vs WDO', icon: <GitMerge className="w-5 h-5" /> }, // NOVO
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ibov_pulse');

  const renderContent = () => {
    switch (activeTab) {
      case 'ibov_pulse':
        return <IbovPulsePage />;
      case 'ibov_analysis':
        return <IbovAnalysisPage />;
      case 'di_curve':
        return <DiCurvePage />;
      case 'stock_analysis':
        return <StockAnalysisPage />;
      case 'correlation':
        return <CorrelationPage />;
      case 'win_wdo_correlation': // NOVO
        return <WinWdoCorrelationPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Super Dashboard</h1>
            </div>
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
          <p>Super Dashboard &copy; {new Date().getFullYear()} - Análise de Mercado Avançada</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
