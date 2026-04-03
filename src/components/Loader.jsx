import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col gap-4 justify-center items-center bg-[#0a0e1a] z-50">
      <motion.div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${
                i === 0 ? '#6366f1' : i === 1 ? '#8b5cf6' : '#a78bfa'
              }, ${
                i === 0 ? '#8b5cf6' : i === 1 ? '#a78bfa' : '#6366f1'
              })`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatDelay: 0.15,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          ></motion.span>
        ))}
      </motion.div>
      <p className="text-sm text-[#64748b] font-medium tracking-wider animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;