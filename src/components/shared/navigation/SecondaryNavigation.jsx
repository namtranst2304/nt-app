'use client'

import { motion } from 'framer-motion'
import useAppStore from '@/lib/store/useAppStore'
import { NAVIGATION_TABS } from '@/constants'

const secondaryNavItems = {
  [NAVIGATION_TABS.CONTENT]: [
    { id: 'playlists', label: 'Playlists', icon: '📋' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    { id: 'library', label: 'Library', icon: '🎬' }
  ],
  [NAVIGATION_TABS.ANALYTICS]: [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'detailed', label: 'Detailed Stats', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' }
  ],
  [NAVIGATION_TABS.PLAYER]: [
    { id: 'current', label: 'Current Video', icon: '▶️' },
    { id: 'queue', label: 'Queue', icon: '🎵' },
    { id: 'controls', label: 'Controls', icon: '🎛️' }
  ],
  [NAVIGATION_TABS.APIS]: [
    { id: 'api-1', label: 'API 1', icon: '🔌' },
    { id: 'api-2', label: 'API 2', icon: '🔌' },
    { id: 'api-3', label: 'API 3', icon: '🔌' },
    { id: 'api-4', label: 'API 4', icon: '🔌' },
    { id: 'api-5', label: 'API 5', icon: '🔌' },
    { id: 'api-6', label: 'API 6 - Weather', icon: '🌤️' }
  ],
  [NAVIGATION_TABS.SETTINGS]: [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ]
}

export default function SecondaryNavigation() {
  const { activeTab, activeSubTab, setActiveSubTab } = useAppStore()

  const items = secondaryNavItems[activeTab] || []

  if (items.length === 0 || activeTab === NAVIGATION_TABS.DASHBOARD) {
    return null
  }

  return (
    <motion.div
      className="w-full glass-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-3">
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSubTab === item.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
