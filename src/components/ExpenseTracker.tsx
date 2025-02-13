
import { DollarSign, TrendingDown, CreditCard, PieChart } from 'lucide-react';

const ExpenseTracker = () => {
  return (
    <div className="space-y-6">
      {/* Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Expenses</p>
              <h3 className="text-2xl font-bold text-white mt-1">$3,586.00</h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Monthly Change</p>
              <h3 className="text-2xl font-bold text-white mt-1">-12.5%</h3>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Fixed Expenses</p>
              <h3 className="text-2xl font-bold text-white mt-1">$2,100.00</h3>
            </div>
            <CreditCard className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Variable Expenses</p>
              <h3 className="text-2xl font-bold text-white mt-1">$1,486.00</h3>
            </div>
            <PieChart className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Expense Categories</h2>
          <div className="space-y-4">
            {[
              { category: 'Housing', amount: 1200, percentage: 33 },
              { category: 'Transportation', amount: 400, percentage: 11 },
              { category: 'Food', amount: 600, percentage: 17 },
              { category: 'Utilities', amount: 300, percentage: 8 },
            ].map((item) => (
              <div key={item.category} className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">{item.category}</span>
                  <span className="text-blue-300">${item.amount}</span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Expenses</h2>
          <div className="space-y-4">
            {[
              { title: 'Grocery Shopping', amount: 156.32, date: 'Today' },
              { title: 'Internet Bill', amount: 89.99, date: 'Yesterday' },
              { title: 'Gas Station', amount: 45.00, date: 'Mar 23, 2024' },
            ].map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">{expense.title}</p>
                  <p className="text-blue-300 text-sm">{expense.date}</p>
                </div>
                <p className="text-white font-medium">${expense.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
