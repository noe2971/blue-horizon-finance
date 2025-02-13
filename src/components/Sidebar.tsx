
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
    <div className="w-64 bg-white border-r border-blue-100">
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-blue-900">BH Finance</h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveComponent(item.value)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                activeComponent === item.value
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
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
