// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

function KeyboardShortcutsModal({ isOpen, onClose }) {
  const shortcuts = [
    { category: 'Video Player', shortcuts: [
      { key: 'Space', action: 'Play/Pause video' },
      { key: '←/→', action: 'Seek backward/forward 10s' },
      { key: '↑/↓', action: 'Volume up/down' },
      { key: 'F', action: 'Toggle fullscreen' },
      { key: 'M', action: 'Mute/Unmute' },
      { key: 'P', action: 'Picture-in-Picture mode' },
    ]},
    { category: 'Navigation', shortcuts: [
      { key: 'Ctrl + K', action: 'Open search' },
      { key: '1-6', action: 'Switch between tabs' },
      { key: 'Esc', action: 'Close modals/exit fullscreen' },
    ]},
    { category: 'General', shortcuts: [
      { key: 'Ctrl + S', action: 'Save settings' },
      { key: 'Ctrl + H', action: 'Toggle help' },
      { key: 'Ctrl + /', action: 'Show shortcuts' },
    ]}
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-2xl rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Keyboard size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                    <p className="text-gray-400">Master NTSync with these shortcuts</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {shortcuts.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.shortcuts.map((shortcut, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="text-gray-300 text-sm">{shortcut.action}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.key.split(' + ').map((key, keyIndex) => (
                              <span key={keyIndex} className="flex items-center gap-1">
                                {keyIndex > 0 && <span className="text-gray-500">+</span>}
                                <kbd className="px-2 py-1 bg-black/30 border border-white/20 rounded text-xs font-mono text-white">
                                  {key}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Press <kbd className="px-2 py-1 bg-black/30 border border-white/20 rounded text-xs font-mono">Ctrl + /</kbd> anytime to open this help
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default KeyboardShortcutsModal;
