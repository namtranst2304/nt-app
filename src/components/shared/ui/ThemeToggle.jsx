// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sun, Moon, MoonStar } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center w-16 h-8 rounded-full p-1 transition-all duration-300 group
        ${isDark 
          ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
          : 'bg-black/10 border border-black/20 hover:bg-black/15'
        }
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50
      `}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      {/* Background slider */}
      <motion.div
        className={`
          absolute left-0.5 w-6 h-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center 
          ${isDark 
            ? 'bg-gradient-to-r from-purple-400 to-blue-400' 
            : 'bg-gradient-to-r from-orange-400 to-yellow-400'
          }
        `}
        animate={{
          x: isDark ? 2 : 34
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Icon inside the slider */}
        <motion.div
          animate={{
            rotate: isDark ? 0 : 180,
            scale: 1
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <MoonStar size={14} className="text-white drop-shadow-sm " />
          ) : (
            <Sun size={14} className="text-white drop-shadow-sm" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
