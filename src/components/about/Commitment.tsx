import React, { useEffect, useRef, useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export const Commitment: React.FC = () => {
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

  const commitments = [
    "Promoting responsible gaming practices",
    "Maintaining the highest security standards",
    "Ensuring fair and transparent odds",
    "Providing 24/7 customer support",
    "Continuously improving our platform based on user feedback",
    "Supporting cricket at all levels"
  ];

  return (
    <div 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A1929]' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative">
              <img 
                src="https://kpbkicpgqdsjdkbaghur.supabase.co/storage/v1/object/sign/contact/CrickWin.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjb250YWN0L0NyaWNrV2luLnBuZyIsImlhdCI6MTc0NTczNzM0MCwiZXhwIjoxNzc3MjczMzQwfQ.X2wu9SOQPLCO0KiuSAeCFxBzwdCZNd05FPDSM70_K34" 
                alt="Cricket stadium" 
                className="rounded-xl shadow-2xl"
              />
              <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-60 rounded-xl ${theme === 'dark' ? 'from-[#0A2540]' : 'from-gray-900'}`}></div>
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#F5B729] to-[#E34C26] rounded-full flex items-center justify-center shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Our Commitment</h2>
            <div className="w-20 h-1 bg-[#1A8754] mb-6" />
            
            <div className={`space-y-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                We are committed to promoting responsible gaming and ensuring our platform remains a safe and enjoyable environment for all users.
              </p>
              
              <div className="space-y-3">
                {commitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-[#1A8754] rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p>{commitment}</p>
                  </div>
                ))}
              </div>
              
              <p>
                Our dedicated support team is available 24/7 to assist you with any queries or concerns. Your satisfaction and trust are our highest priorities.
              </p>
              
              <div className="mt-8">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-[#F5B729] text-[#0A2540] font-bold rounded-lg hover:bg-[#E3A82A] transition-colors duration-300"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};