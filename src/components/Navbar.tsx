
import { Bell, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <nav className="bg-white border-b border-blue-100 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-900">Blue Horizon Finance</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-blue-50 rounded-full">
            <Bell className="h-5 w-5 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-blue-50 rounded-full">
            <Settings className="h-5 w-5 text-blue-600" />
          </button>
          <button 
            className="p-2 hover:bg-blue-50 rounded-full"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-blue-600" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
