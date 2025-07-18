'use client'

import { motion } from 'framer-motion'
import useAppStore from '@/lib/store/useAppStore'
import { ANALYTICS_SUBTABS } from '@/constants'
import { SecondaryNavigation } from '@/components/shared/navigation'

// Analytics components
const Statistics = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Watch Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-500/20 p-4 rounded-lg">
          <h3 className="text-sm text-purple-200">Total Watch Time</h3>
          <p className="text-2xl font-bold text-white">24h 32m</p>
        </div>
        <div className="bg-blue-500/20 p-4 rounded-lg">
          <h3 className="text-sm text-blue-200">Videos Watched</h3>
          <p className="text-2xl font-bold text-white">156</p>
        </div>
        <div className="bg-green-500/20 p-4 rounded-lg">
          <h3 className="text-sm text-green-200">Average Session</h3>
          <p className="text-2xl font-bold text-white">9m 25s</p>
        </div>
      </div>
    </div>
  </div>
)

const Reports = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Analytics Reports</h2>
      <div className="space-y-4">
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="font-medium text-white">Weekly Report</h3>
          <p className="text-sm text-gray-300">Generated on July 16, 2025</p>
          <button className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
            Download PDF
          </button>
        </div>
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="font-medium text-white">Monthly Summary</h3>
          <p className="text-sm text-gray-300">Generated on July 1, 2025</p>
          <button className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
)

const Insights = () => (
  <div className="space-y-6">
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">Viewing Insights</h2>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg">
          <h3 className="font-medium text-white">Peak Viewing Time</h3>
          <p className="text-sm text-gray-300">You watch most videos between 7-9 PM</p>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4 rounded-lg">
          <h3 className="font-medium text-white">Favorite Genre</h3>
          <p className="text-sm text-gray-300">Technology tutorials make up 40% of your watch time</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg">
          <h3 className="font-medium text-white">Watch Pattern</h3>
          <p className="text-sm text-gray-300">You tend to watch longer videos on weekends</p>
        </div>
      </div>
    </div>
  </div>
)

export default function AnalyticsRouter() {
  const { activeSubTab } = useAppStore()

  const renderContent = () => {
    switch (activeSubTab) {
      case ANALYTICS_SUBTABS.OVERVIEW:
        return <Statistics />
      case ANALYTICS_SUBTABS.DETAILED:
        return <Reports />
      case ANALYTICS_SUBTABS.REPORTS:
        return <Insights />
      default:
        return <Statistics />
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
