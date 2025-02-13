
import { Bell, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <nav className="bg-[#0A1929] border-b border-blue-900/30 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Blue Horizon Finance</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-blue-800/30 rounded-full text-blue-300">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-blue-800/30 rounded-full text-blue-300">
            <Settings className="h-5 w-5" />
          </button>
          <button 
            className="p-2 hover:bg-blue-800/30 rounded-full text-blue-300"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
