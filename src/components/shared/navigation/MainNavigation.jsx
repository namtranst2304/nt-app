'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import useAppStore from '@/lib/store/useAppStore'
import { NAVIGATION_TABS } from '@/constants'
import { ThemeToggle } from '@/components/shared/ui'

const navigationItems = [
  { 
    id: NAVIGATION_TABS.DASHBOARD, 
    label: 'Dashboard', 
    description: 'Overview and quick access',
    color: 'from-blue-500 to-purple-500'
  },
  { 
    id: NAVIGATION_TABS.CONTENT, 
    label: 'Content', 
    description: 'Videos, playlists, and media',
    color: 'from-green-500 to-teal-500'
  },
  { 
    id: NAVIGATION_TABS.PLAYER, 
    label: 'Player', 
    description: 'Video player and controls',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: NAVIGATION_TABS.ANALYTICS, 
    label: 'Analytics', 
    description: 'Statistics and insights',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: NAVIGATION_TABS.APIS, 
    label: 'APIs Testing', 
    description: 'Test and manage APIs',
    color: 'from-indigo-500 to-cyan-500'
  },
  { 
    id: NAVIGATION_TABS.SETTINGS, 
    label: 'Settings', 
    description: 'App configuration',
    color: 'from-gray-500 to-slate-500'
  }
]

export default function MainNavigation() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              NTSync
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {activeTab === item.id && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg opacity-80`}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs opacity-75">{item.description}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <motion.button
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>
            <motion.button
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}
