import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Trophy } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`${theme === 'dark' ? 'bg-[#0A2540]' : 'bg-white'} relative overflow-hidden`}>
      {/* Decorative cricket ball pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px]">
          <div className="w-full h-full rounded-full border-[8px] border-[#F5B729]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[70%] h-[70%] border-[4px] border-dashed border-[#F5B729] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://kpbkicpgqdsjdkbaghur.supabase.co/storage/v1/object/sign/teamlogo/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZWFtbG9nby9sb2dvLnBuZyIsImlhdCI6MTc0NjUxNTc5MiwiZXhwIjoxNzc4MDUxNzkyfQ.msQqgUyvfmrQLL0KB2Z-uWvIySbOQqV8CBXX0RPaoHA"
                    alt="Logo"
                    className="h-12 w-12 object-contain"
                  />
              <h3 className="text-2xl font-bold text-[#F5B729]">CrickWin</h3>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience the thrill of cricket game with CrickWin - Your trusted platform for secure and responsible gaming.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Home</Link>
              </li>
              <li>
                <Link to="/matches" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Matches</Link>
              </li>
              <li>
                <Link to="/how-to-play" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>How to Play</Link>
              </li>
              <li>
                <Link to="/about" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>About Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Privacy Policy</Link>
              </li>
              <li>
                <Link to="/responsible-gaming" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Responsible Gaming</Link>
              </li>
              <li>
                <Link to="/fair-play" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} transition-colors duration-300`}>Fair Play Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contact Us</h4>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Have questions? Our support team is available 24/7 to assist you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 text-[#F5B729] hover:text-[#E3A82A] transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>Get in touch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-16 pt-8 border-t ${theme === 'dark' ? 'border-[#1A3A5C]' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              &copy; {new Date().getFullYear()} CrickWin. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} text-sm transition-colors duration-300`}>
                Terms
              </Link>
              <Link to="/privacy" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} text-sm transition-colors duration-300`}>
                Privacy
              </Link>
              <Link to="/cookies" className={`${theme === 'dark' ? 'text-gray-400 hover:text-[#F5B729]' : 'text-gray-600 hover:text-[#F5B729]'} text-sm transition-colors duration-300`}>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}