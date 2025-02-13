
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import FinanceAdvisor from '@/components/FinanceAdvisor';
import ExpenseTracker from '@/components/ExpenseTracker';
import ETF from '@/components/ETF';
import Stocks from '@/components/Stocks';
import Lessons from '@/components/Lessons';
import { Search } from 'lucide-react';
import HealthCheck from '@/components/HealthCheck';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const Index = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'advisor':
        return <FinanceAdvisor />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'etf':
        return <ETF />;
      case 'stocks':
        return <Stocks />;
      case 'lessons':
        return <Lessons />;
      case 'health':
        return <HealthCheck />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-blue-900 to-blue-50">
          <div className="container mx-auto px-6 py-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:border-blue-500 bg-white/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
