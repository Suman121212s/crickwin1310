import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X, Sun, Moon, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  name: string;
  profile_picture_url: string | null;
  role: string | null;
}

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  async function fetchUserProfile() {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, profile_picture_url, role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/matches', label: 'Matches' },
    { path: '/how-to-play', label: 'How to Play' },
    { path: '/about', label: 'About' },
    { path: '/highlights', label: 'Highlights' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-[#0A2540]' : 'bg-white'} shadow-lg border-b ${theme === 'dark' ? 'border-[#1A3A5C]' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
src="https://kpbkicpgqdsjdkbaghur.supabase.co/storage/v1/object/sign/teamlogo/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZWFtbG9nby9sb2dvLnBuZyIsImlhdCI6MTc0NjUxNTc5MiwiZXhwIjoxNzc4MDUxNzkyfQ.msQqgUyvfmrQLL0KB2Z-uWvIySbOQqV8CBXX0RPaoHA"
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#004aad] to-[#cb6ce6] bg-clip-text text-transparent">
              CrickWin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[#F5B729] bg-[#1A8754]/10'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                    : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                  : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu or Auth Links */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                      : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                  }`}
                >
                  {/* Profile Picture */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#F5B729]">
                    {userProfile?.profile_picture_url ? (
                      <img
                        src={userProfile.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full ${theme === 'dark' ? 'bg-[#1A3A5C]' : 'bg-gray-200'} flex items-center justify-center`}>
                        <User className="w-4 h-4 text-[#F5B729]" />
                      </div>
                    )}
                  </div>
                  
                  {/* User Name */}
                  <span className="hidden sm:block font-medium">
                    {userProfile?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-[#0A2540]' : 'bg-white'} rounded-md shadow-lg border ${theme === 'dark' ? 'border-[#1A3A5C]' : 'border-gray-200'} z-50`}>
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-[#1A3A5C]' : 'border-gray-200'}`}>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {userProfile?.name || 'User'}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1A3A5C] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-200`}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      {userProfile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1A3A5C] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-200`}
                        >
                          <Trophy className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <Link
                        to="/deposit"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1A3A5C] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} transition-colors duration-200`}
                      >
                        <CreditCard className="w-4 h-4 mr-3" />
                        Deposit
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} transition-colors duration-200`}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                      : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#F5B729] text-[#0A2540] text-sm font-medium rounded-md hover:bg-[#E3A82A] transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                  : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden border-t ${theme === 'dark' ? 'border-[#1A3A5C]' : 'border-gray-200'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-[#F5B729] bg-[#1A8754]/10'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                      : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                        : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  {userProfile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                          : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/deposit"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-[#F5B729] hover:bg-[#1A3A5C]'
                        : 'text-gray-700 hover:text-[#F5B729] hover:bg-gray-100'
                    }`}
                  >
                    Deposit
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}