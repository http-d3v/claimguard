import { motion } from "framer-motion";

export default function Mascot({ state = "idle", className = "" }: { state?: "idle" | "scanning" | "error" | "success", className?: string }) {
  // A cute blob/shield SVG
  return (
    <motion.div 
      className={`relative w-32 h-32 ${className}`}
      animate={{
        y: state === "scanning" ? [0, -10, 0] : state === "success" ? [0, -20, 0] : [0, -5, 0],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: state === "scanning" ? 1 : state === "success" ? 0.5 : 3,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <motion.path 
          fill={state === "error" ? "#FF8A8A" : state === "success" ? "#76E5B1" : "#B39DFF"} 
          d="M45,-75.6C58.3,-68.5,69,-54.3,77.5,-39.1C85.9,-23.9,92.1,-7.7,89.5,7.4C86.9,22.5,75.4,36.5,63.1,48.2C50.8,59.8,37.6,69.2,22.4,75.7C7.2,82.3,-10.1,86.1,-25.5,81.8C-40.8,77.5,-54.1,65.2,-64.5,51.2C-74.8,37.2,-82.2,21.5,-85.4,4.9C-88.5,-11.6,-87.4,-29,-79.1,-43.2C-70.8,-57.3,-55.4,-68.2,-40.1,-74.6C-24.8,-81,-9.6,-83,6.5,-91.6C22.6,-100.1,45,-115.3,45,-75.6Z" 
          transform="translate(100 100)" 
          animate={{
            d: state === "scanning" 
              ? "M48,-74.6C60.3,-66.5,68,-51.3,78.5,-36.1C88.9,-20.9,97.1,-4.7,93.5,9.4C89.9,23.5,74.4,35.5,62.1,47.2C49.8,58.8,36.6,68.2,21.4,74.7C6.2,81.3,-11.1,85.1,-26.5,80.8C-41.8,76.5,-55.1,64.2,-65.5,50.2C-75.8,36.2,-83.2,20.5,-86.4,3.9C-89.5,-12.6,-88.4,-30,-80.1,-44.2C-71.8,-58.3,-56.4,-69.2,-41.1,-75.6C-25.8,-82,-10.6,-84,5.5,-92.6C21.6,-101.1,48,-116.3,48,-74.6Z"
              : "M45,-75.6C58.3,-68.5,69,-54.3,77.5,-39.1C85.9,-23.9,92.1,-7.7,89.5,7.4C86.9,22.5,75.4,36.5,63.1,48.2C50.8,59.8,37.6,69.2,22.4,75.7C7.2,82.3,-10.1,86.1,-25.5,81.8C-40.8,77.5,-54.1,65.2,-64.5,51.2C-74.8,37.2,-82.2,21.5,-85.4,4.9C-88.5,-11.6,-87.4,-29,-79.1,-43.2C-70.8,-57.3,-55.4,-68.2,-40.1,-74.6C-24.8,-81,-9.6,-83,6.5,-91.6C22.6,-100.1,45,-115.3,45,-75.6Z"
          }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
        />
        {/* Eyes */}
        <circle cx="70" cy="80" r="10" fill="#2D2A32" />
        <circle cx="130" cy="80" r="10" fill="#2D2A32" />
        
        {/* Eye highlights */}
        <circle cx="67" cy="77" r="3" fill="white" />
        <circle cx="127" cy="77" r="3" fill="white" />

        {/* Mouth */}
        {state === "error" ? (
          <path d="M 85 110 Q 100 100 115 110" stroke="#2D2A32" strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : state === "success" ? (
          <path d="M 85 110 Q 100 130 115 110" stroke="#2D2A32" strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : state === "scanning" ? (
          <circle cx="100" cy="115" r="8" fill="#2D2A32" />
        ) : (
          <path d="M 90 110 Q 100 115 110 110" stroke="#2D2A32" strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
      </svg>
      
      {state === "scanning" && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center -right-16 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <span className="text-4xl">🔍</span>
        </motion.div>
      )}
    </motion.div>
  );
}
