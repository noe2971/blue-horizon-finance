
import { BarChart2, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Balance</p>
              <h3 className="text-2xl font-bold text-white mt-1">$24,563.00</h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">+2.5%</span>
            <span className="text-blue-200 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Investments</p>
              <h3 className="text-2xl font-bold text-white mt-1">$12,345.00</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">+5.2%</span>
            <span className="text-blue-200 text-sm ml-2">this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Expenses</p>
              <h3 className="text-2xl font-bold text-white mt-1">$3,586.00</h3>
            </div>
            <PieChart className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <span className="text-red-400 text-sm">-1.2%</span>
            <span className="text-blue-200 text-sm ml-2">this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Portfolio Value</p>
              <h3 className="text-2xl font-bold text-white mt-1">$45,234.00</h3>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">+3.8%</span>
            <span className="text-blue-200 text-sm ml-2">this quarter</span>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Market Overview</h2>
        <div className="h-64 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg flex items-center justify-center">
          <p className="text-blue-300">Market Chart Placeholder</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-white font-medium">Stock Purchase</p>
                  <p className="text-blue-300 text-sm">Apple Inc.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">-$2,456.00</p>
                <p className="text-blue-300 text-sm">Mar 24, 2024</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
