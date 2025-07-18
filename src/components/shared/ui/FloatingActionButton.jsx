import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  Bookmark, 
  Search, 
  HelpCircle,
  X,
  MessageCircle
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import VideoNotes from './VideoNotes';

function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false); // rename for clarity
  const { setActiveTab } = useAppStore();
  const actions = [
    {
      icon: Upload,
      label: 'Upload Video',
      action: () => setActiveTab('player'),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      icon: Bookmark,
      label: 'Create Playlist',
      action: () => setActiveTab('playlists'),
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      icon: MessageCircle,
      label: 'Video Notes',
      action: () => setIsNotesOpen(true), // use setIsNotesOpen
      color: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
    },
    {
      icon: Search,
      label: 'Search',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-search'));
      },
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      icon: HelpCircle,
      label: 'Help & Shortcuts',
      action: () => {
        window.dispatchEvent(new CustomEvent('show-shortcuts'));
      },
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    }
  ];

  const handleActionClick = (action) => {
    action.action();
    setIsOpen(false);
  };
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-20 right-0 flex flex-col items-end space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 50, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.3 }}
                transition={{ 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <motion.div 
                  className="glass-card px-3 py-2 rounded-lg opacity-0"
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.08) + 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.div>
                
                {/* Action Button */}
                <motion.button
                  onClick={() => handleActionClick(action)}
                  className={`w-10 h-10 rounded-full ${action.color} shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl`}
                  whileHover={{ 
                    scale: 1.15,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <action.icon size={18} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg flex items-center justify-center text-white relative overflow-hidden"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 12px 35px rgba(139, 92, 246, 0.4)",
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          rotate: isOpen ? 45 : 0,
          boxShadow: isOpen 
            ? "0 15px 40px rgba(139, 92, 246, 0.5)" 
            : "0 10px 30px rgba(139, 92, 246, 0.3)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30 
        }}
      >
        {/* Gradient overlay for extra shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
        
        <motion.div
          animate={{ rotate: isOpen ? -45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Render VideoNotes panel if isNotesOpen is true */}
      <VideoNotes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}

export default FloatingActionButton;
