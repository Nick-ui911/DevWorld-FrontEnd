import React from "react";
import { Users, Code, Shield, Rocket } from "lucide-react";

const features = [
  {
    icon: Users,
    color: "#fb7185",
    title: "Community",
    description: "Connect with developers worldwide and build lasting professional relationships.",
  },
  {
    icon: Code,
    color: "#818cf8",
    title: "Experts",
    description: "Learn from industry experts working on real-world cutting-edge projects.",
  },
  {
    icon: Shield,
    color: "#34d399",
    title: "Security",
    description: "Your data privacy and security is our top priority. Always protected.",
  },
  {
    icon: Rocket,
    color: "#fbbf24",
    title: "Growth",
    description: "Accelerate your skills and career trajectory with hands-on collaboration.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="relative w-full text-white py-24 px-6 text-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <p className="text-[11px] font-bold text-indigo-400 tracking-[0.3em] uppercase mb-4">Features</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          What We <span className="gradient-text">Offer</span>
        </h2>
        <p className="text-[#94a3b8] text-base max-w-lg mx-auto mb-16 leading-relaxed">
          Everything you need to grow as a developer, all in one place
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col items-center group cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon container with glow */}
                <div className="relative mb-6">
                  <div
                    className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ background: feature.color }}
                  ></div>
                  <div
                    className="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${feature.color}12`,
                      border: `1px solid ${feature.color}25`,
                    }}
                  >
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
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
