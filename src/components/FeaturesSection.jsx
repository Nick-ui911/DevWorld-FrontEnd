import React from "react";
import { Users, Code, Shield, Rocket } from "lucide-react";

const features = [
  {
    icon: Users,
    color: "#f43f5e",
    title: "Community",
    description: "Connect with developers worldwide.",
  },
  {
    icon: Code,
    color: "#6366f1",
    title: "Experts",
    description: "Learn from experts who work on real-world projects.",
  },
  {
    icon: Shield,
    color: "#10b981",
    title: "Security",
    description: "Your data is safe with us.",
  },
  {
    icon: Rocket,
    color: "#f59e0b",
    title: "Growth",
    description: "Boost your skills & career.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="relative w-full text-white py-20 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3">Features</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-14">
          What We <span className="gradient-text">Offer</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col items-center transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
