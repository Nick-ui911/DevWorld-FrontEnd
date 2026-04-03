import React, { useState, useEffect } from 'react';
import { Users, Globe, Code, TrendingUp, Award, PieChart, Server, Activity } from 'lucide-react';

const UsersCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stats = [
    { icon: <Users size={28} />, number: "10,000+", label: "Active Developers", color: "#f43f5e" },
    { icon: <Globe size={28} />, number: "50+", label: "Countries Represented", color: "#6366f1" },
    { icon: <Code size={28} />, number: "25,000+", label: "Projects Created", color: "#10b981" },
    { icon: <TrendingUp size={28} />, number: "95%", label: "User Satisfaction", color: "#8b5cf6" },
    { icon: <Award size={28} />, number: "15+", label: "Industry Awards", color: "#f59e0b" },
    { icon: <PieChart size={28} />, number: "200M+", label: "Lines of Code", color: "#6366f1" },
    { icon: <Server size={28} />, number: "99.9%", label: "Uptime Guarantee", color: "#14b8a6" },
    { icon: <Activity size={28} />, number: "24/7", label: "Community Support", color: "#ec4899" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 4) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleStats = stats.slice(currentIndex, currentIndex + 4).concat(
    stats.slice(0, Math.max(0, (currentIndex + 4) - stats.length))
  );

  return (
    <div className="relative w-full z-0 py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <p className="text-center text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3">Statistics</p>
        <h2 className="text-center text-white text-3xl md:text-4xl font-bold mb-14 tracking-tight">
          DevWorld by the <span className="gradient-text">Numbers</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
          {visibleStats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card glass-card-hover rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-1"
              style={{
                animation: 'fadeIn 0.5s ease-in-out',
                animationFillMode: 'both',
                animationDelay: `${index * 0.15}s`
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `${stat.color}12`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {stat.number}
              </h3>
              <p className="text-[#94a3b8] text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersCarousel;