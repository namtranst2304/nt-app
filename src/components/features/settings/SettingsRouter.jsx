'use client'

import { motion } from 'framer-motion'
import useAppStore from '@/lib/store/useAppStore'
import { SETTINGS_SUBTABS } from '@/constants'
import { SecondaryNavigation } from '@/components/shared/navigation'
import { ThemeToggle } from '@/components/shared/ui'

// Settings components
const General = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Theme</h3>
            <p className="text-sm text-gray-300">Choose your preferred theme</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Auto-play Videos</h3>
            <p className="text-sm text-gray-300">Automatically play next video in playlist</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Notifications</h3>
            <p className="text-sm text-gray-300">Enable desktop notifications</p>
          </div>
          <input type="checkbox" className="toggle" />
        </div>
      </div>
    </div>
  </div>
)

const Player = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Player Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Default Volume</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="50"
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Playback Speed</label>
          <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Picture-in-Picture</h3>
            <p className="text-sm text-gray-300">Enable PiP mode</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Auto-quality</h3>
            <p className="text-sm text-gray-300">Automatically adjust video quality</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
      </div>
    </div>
  </div>
)

const Appearance = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Theme</h3>
            <p className="text-sm text-gray-300">Choose your preferred theme</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Animations</h3>
            <p className="text-sm text-gray-300">Enable smooth animations</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Blur Effects</h3>
            <p className="text-sm text-gray-300">Enable glassmorphism blur effects</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">UI Scale</label>
          <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="small">Small</option>
            <option value="medium" selected>Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)

const Privacy = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Save Watch History</h3>
            <p className="text-sm text-gray-300">Keep track of watched videos</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Analytics</h3>
            <p className="text-sm text-gray-300">Help improve the app with usage data</p>
          </div>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="border-t border-gray-600 pt-4">
          <h3 className="font-medium text-white mb-2">Clear Data</h3>
          <div className="space-y-2">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm">
              Clear Watch History
            </button>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
              Clear Playlists
            </button>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const About = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">About NTSync</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-white">Version</h3>
          <p className="text-sm text-gray-300">2.0.0</p>
        </div>
        <div>
          <h3 className="font-medium text-white">Built with</h3>
          <p className="text-sm text-gray-300">Next.js 14, React 18, Tailwind CSS</p>
        </div>
        <div>
          <h3 className="font-medium text-white">Developer</h3>
          <p className="text-sm text-gray-300">NTSync Team</p>
        </div>
        <div className="border-t border-gray-600 pt-4">
          <h3 className="font-medium text-white mb-2">Keyboard Shortcuts</h3>
          <div className="space-y-1 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Dashboard</span>
              <span className="bg-gray-700 px-2 py-1 rounded">1</span>
            </div>
            <div className="flex justify-between">
              <span>Content</span>
              <span className="bg-gray-700 px-2 py-1 rounded">2</span>
            </div>
            <div className="flex justify-between">
              <span>Player</span>
              <span className="bg-gray-700 px-2 py-1 rounded">3</span>
            </div>
            <div className="flex justify-between">
              <span>Analytics</span>
              <span className="bg-gray-700 px-2 py-1 rounded">4</span>
            </div>
            <div className="flex justify-between">
              <span>Settings</span>
              <span className="bg-gray-700 px-2 py-1 rounded">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function SettingsRouter() {
  const { activeSubTab } = useAppStore()

  const renderContent = () => {
    switch (activeSubTab) {
      case SETTINGS_SUBTABS.GENERAL:
        return <General />
      case SETTINGS_SUBTABS.APPEARANCE:
        return <Appearance />
      case SETTINGS_SUBTABS.PRIVACY:
        return <Privacy />
      case SETTINGS_SUBTABS.ABOUT:
        return <About />
      default:
        return <General />
    }
  }

  return (
    <div className="space-y-6">
      <SecondaryNavigation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
