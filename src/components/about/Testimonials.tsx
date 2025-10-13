import React, { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Testimonials: React.FC = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
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

  const testimonials = [
    {
      name: "Vikram Singh",
      location: "Mumbai, India",
      quote: "CrickWin has transformed how I engage with cricket matches. Their predictions are incredibly accurate, and the platform is easy to use.",
      rating: 5,
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    },
    {
      name: "James Wilson",
      location: "London, UK",
      quote: "I've tried many cricket gaming platforms, but CrickWin stands out for its fairness and transparency. The payouts are quick, and customer service is excellent.",
      rating: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    },
    {
      name: "Sophie Taylor",
      location: "Sydney, Australia",
      quote: "As a lifelong cricket fan, I appreciate the depth of analysis that CrickWin provides. It helps me make informed decisions and enhances my enjoyment of the matches.",
      rating: 4,
      image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-b from-[#0D3158] to-[#0A1929]' : 'bg-gradient-to-b from-gray-200 to-gray-100'}`}
    >
      {/* Cricket themed pattern background */}
      <div className={`absolute inset-0 opacity-5`}>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={`w-20 h-20 rounded-full border-4 absolute top-[10%] left-[10%] ${theme === 'dark' ? 'border-white' : 'border-gray-400'}`}></div>
          <div className={`w-32 h-32 rounded-full border-4 absolute top-[30%] right-[15%] ${theme === 'dark' ? 'border-white' : 'border-gray-400'}`}></div>
          <div className={`w-16 h-16 rounded-full border-4 absolute bottom-[20%] left-[20%] ${theme === 'dark' ? 'border-white' : 'border-gray-400'}`}></div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What Our Users Say</h2>
          <div className="w-20 h-1 bg-[#1A8754] mx-auto mb-6" />
        </div>
        
        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className={`rounded-xl shadow-2xl p-8 md:p-12 overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-[#0A2540] to-[#0D3158]' : 'bg-white border border-gray-200'}`}>
            <div className="relative z-10">
              <div className="mb-8 flex justify-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${index === activeIndex ? 'bg-[#F5B729]' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#F5B729]">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F5B729] fill-[#F5B729]" />
                  ))}
                </div>
                
                <blockquote className={`text-xl md:text-2xl italic mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  "{testimonials[activeIndex].quote}"
                </blockquote>
                
                <div className="text-[#F5B729] font-bold text-lg mb-1">{testimonials[activeIndex].name}</div>
                <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{testimonials[activeIndex].location}</div>
              </div>
            </div>
            
            {/* Decorative cricket elements */}
            <div className={`absolute top-0 left-0 w-40 h-40 opacity-10`}>
              <div className="w-full h-full rounded-full border-[8px] border-[#F5B729]"></div>
            </div>
            <div className={`absolute bottom-0 right-0 w-60 h-60 opacity-10`}>
              <div className="w-full h-full rounded-full border-[8px] border-[#F5B729]"></div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevTestimonial} 
              className={`p-3 rounded-full text-white hover:bg-[#1A8754] transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0D3158]' : 'bg-gray-600'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextTestimonial} 
              className={`p-3 rounded-full text-white hover:bg-[#1A8754] transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0D3158]' : 'bg-gray-600'}`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};