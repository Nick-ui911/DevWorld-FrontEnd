import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col gap-5 justify-center items-center bg-[#070b14] z-50">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
      </div>

      {/* Animated dots */}
      <motion.div className="relative flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3.5 h-3.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${
                i === 0 ? '#818cf8' : i === 1 ? '#a78bfa' : '#c4b5fd'
              }, ${
                i === 0 ? '#a78bfa' : i === 1 ? '#c4b5fd' : '#818cf8'
              })`,
              boxShadow: `0 0 12px ${
                i === 0 ? 'rgba(129,140,248,0.4)' : i === 1 ? 'rgba(167,139,250,0.4)' : 'rgba(196,181,253,0.4)'
              }`,
            }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatDelay: 0.1,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          ></motion.span>
        ))}
      </motion.div>

      {/* Brand text */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm text-[#64748b] font-medium tracking-widest uppercase">Loading</span>
      </div>
    </div>
  );
};

export default Loader;