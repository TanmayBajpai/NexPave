import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, AlertTriangle } from 'lucide-react';
import Logo from './Logo';
import { Link } from "react-router-dom";
const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="http://localhost:5173/" className="flex items-center">
                <Logo />
                <span className="ml-2 text-xl font-bold text-primary-500">NexPave</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }>
                Home
              </NavLink>
              <NavLink to="/report" className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }>
                Report
              </NavLink>
              <NavLink to="/contractor" className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }>
                Contractor
              </NavLink>
              <NavLink to="/admin" className={({ isActive }) => 
                isActive ? "nav-link nav-link-active" : "nav-link"
              }>
                Admin
              </NavLink>
              <button
                onClick={toggleDarkMode}
                className="ml-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={toggleMenu}
                className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden animate-fade-in">
              <div className="pt-2 pb-4 space-y-1">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/report" 
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Report
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/contractor" 
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contractor
                </NavLink>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md ${isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      
      <footer className="bg-primary-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo white />
                <span className="ml-2 text-xl font-bold">NexPave</span>
              </div>
              <p className="text-neutral-300">
                Transforming everyday commuters into guardians of the street.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><NavLink to="/" className="text-neutral-300 hover:text-white transition-colors">Home</NavLink></li>
                <li><NavLink to="/report" className="text-neutral-300 hover:text-white transition-colors">Report a Pothole</NavLink></li>
                <li><NavLink to="/dashboard" className="text-neutral-300 hover:text-white transition-colors">View Dashboard</NavLink></li>
                <li><NavLink to="/contractor" className="text-neutral-300 hover:text-white transition-colors">Contractor Portal</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <p className="text-neutral-300 mb-2">Have questions or feedback?</p>
              <a href="mailto:info@nexpave.com" className="text-accent-400 hover:text-accent-300 transition-colors">
                info@nexpave.com
              </a>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-4 text-neutral-400 text-sm">
            <p>© {new Date().getFullYear()} NexPave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;