import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Nav links for unauthenticated users
  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent -mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-4">
        <div className="flex justify-between items-center h-12 rounded-full bg-gray-50 border border-gray-200 px-8 shadow-sm">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors flex-shrink-0"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span>Resumate</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 relative group transition-colors font-medium text-sm"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/history"
                  className="text-gray-700 hover:text-blue-600 relative group transition-colors font-medium text-sm"
                >
                  History
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-gray-700 hover:text-blue-600 relative group transition-colors font-medium text-sm"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-gray-700 hover:text-blue-600 relative group transition-colors font-medium text-sm"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  )
                ))}
              </>
            )}
          </div>

          {/* Desktop Actions - Right */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium text-sm">
                  {user?.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300 text-sm"
                >
                  Join now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 rounded-b-3xl mt-2 shadow-sm">
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    History
                  </Link>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="px-4 py-2 text-gray-700 font-medium text-sm">
                      {user?.email || 'User'}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    link.href.startsWith('/') ? (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-4 py-2 text-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-6 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-colors text-center text-sm"
                    >
                      Join now
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
