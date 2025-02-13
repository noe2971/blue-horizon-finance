
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

const Stocks = () => {
  const stockData = [
    { name: 'AAPL', price: 172.45, change: '+1.23%', volume: '45.2M' },
    { name: 'MSFT', price: 415.32, change: '-0.45%', volume: '22.1M' },
    { name: 'GOOGL', price: 147.68, change: '+2.15%', volume: '18.7M' },
    { name: 'AMZN', price: 178.25, change: '+0.78%', volume: '31.4M' },
  ];

  const etfData = [
    { name: 'VOO', price: 445.78, change: '+0.89%', volume: '4.2M' },
    { name: 'VTI', price: 242.15, change: '+0.67%', volume: '3.8M' },
    { name: 'QQQ', price: 438.92, change: '+1.12%', volume: '5.1M' },
    { name: 'SPY', price: 510.34, change: '+0.91%', volume: '6.3M' },
  ];

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Stocks</h2>
          <div className="space-y-4">
            {stockData.map((stock) => (
              <div key={stock.name} className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{stock.name}</h3>
                    <p className="text-blue-300 text-sm">Vol: {stock.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${stock.price}</p>
                    <p className={stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {stock.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Popular ETFs</h2>
          <div className="space-y-4">
            {etfData.map((etf) => (
              <div key={etf.name} className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{etf.name}</h3>
                    <p className="text-blue-300 text-sm">Vol: {etf.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${etf.price}</p>
                    <p className={etf.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {etf.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Market Performance</h2>
          <div className="h-64 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg flex items-center justify-center">
            <p className="text-blue-300">Market Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;
