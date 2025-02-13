
import { Home, PieChart, LineChart, BookOpen, Heart, MessageSquare, BarChart2 } from 'lucide-react';

interface SidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const Sidebar = ({ setActiveComponent, activeComponent }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', value: 'dashboard' },
    { icon: MessageSquare, label: 'AI Advisor', value: 'advisor' },
    { icon: PieChart, label: 'Expenses', value: 'expenses' },
    { icon: LineChart, label: 'ETFs', value: 'etf' },
    { icon: BarChart2, label: 'Stocks', value: 'stocks' },
    { icon: BookOpen, label: 'Lessons', value: 'lessons' },
    { icon: Heart, label: 'Financial Health', value: 'health' },
  ];

  return (
    <div className="w-64 bg-[#0A1929] border-r border-blue-900/30">
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-900/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">BH Finance</h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveComponent(item.value)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                activeComponent === item.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-blue-300 hover:bg-blue-800/30'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
