import React, { useEffect, useRef, useState } from 'react';
import { Shield, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const MissionVision: React.FC = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'}`}
    >
      {/* Cricket field lines background decoration */}
      <div className={`absolute inset-0 opacity-5`}>
        <div className={`absolute left-1/2 top-0 bottom-0 w-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute left-1/4 top-0 bottom-0 w-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute left-3/4 top-0 bottom-0 w-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute top-1/2 left-0 right-0 h-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute top-1/4 left-0 right-0 h-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute top-3/4 left-0 right-0 h-px ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[30%] h-[30%] border-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'border-white' : 'border-gray-400'}`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Our Mission & Vision</h2>
          <div className="w-20 h-1 bg-[#1A8754] mx-auto mb-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={`p-8 rounded-xl shadow-xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} ${theme === 'dark' ? 'bg-gradient-to-br from-[#0D3158] to-[#0A2540]' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`flex-shrink-0 p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-100'}`}>
                <Shield className="text-[#F5B729] w-8 h-8" />
              </div>
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Our Mission</h3>
            </div>
            
            <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                To provide a secure and enjoyable platform for cricket enthusiasts to engage with their favorite sport through responsible gaming and predictions.
              </p>
              <p>
                We strive to combine cutting-edge technology with deep cricket knowledge to create the most accurate and fair gaming experience in the industry.
              </p>
            </div>
            
            <div className="mt-8">
              <img 
                src="https://kpbkicpgqdsjdkbaghur.supabase.co/storage/v1/object/sign/contact/istockphoto-1402084914-612x612.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjb250YWN0L2lzdG9ja3Bob3RvLTE0MDIwODQ5MTQtNjEyeDYxMi5qcGciLCJpYXQiOjE3NDU0Mjg4MDQsImV4cCI6MTc3Njk2NDgwNH0.UyLbRhzWIVwpGxAFJLSYhJEyqLFVZ-jQV-lWB6FDxZI" 
                alt="Cricket stadium" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
          
          <div className={`p-8 rounded-xl shadow-xl transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} ${theme === 'dark' ? 'bg-gradient-to-br from-[#0D3158] to-[#0A2540]' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`flex-shrink-0 p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-100'}`}>
                <Users className="text-[#F5B729] w-8 h-8" />
              </div>
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Who We Are</h3>
            </div>
            
            <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                A team of cricket lovers, technology experts, and gaming professionals dedicated to creating the best cricket gaming experience.
              </p>
              <p>
                Our diverse team brings together decades of experience in cricket analysis, software development, and the gaming industry to create a platform that truly understands the needs of cricket fans.
              </p>
            </div>
            
            <div className="mt-8">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Team collaboration" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};