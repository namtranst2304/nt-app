import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  // Listen for custom notification events
  useEffect(() => {
    const handleNotification = (event) => {
      const { type, message, duration = 3000 } = event.detail;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        type,
        message,
        duration
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    };

    window.addEventListener('show-notification', handleNotification);
    return () => window.removeEventListener('show-notification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-400" />;
      case 'error': return <AlertCircle size={20} className="text-red-400" />;
      case 'info': return <Info size={20} className="text-blue-400" />;
      default: return <Info size={20} className="text-gray-400" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`glass-card p-4 rounded-xl border ${getBackgroundColor(notification.type)} backdrop-blur-md min-w-80 max-w-96`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{notification.message}</p>
              </div>
              <motion.button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} className="text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationSystem;
