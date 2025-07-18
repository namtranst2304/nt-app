'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import useAppStore from '@/lib/store/useAppStore'
import { NAVIGATION_TABS } from '@/constants'
import { AppLayout } from '@/components/shared/layout'
import { useKeyboardShortcuts } from '@/hooks'

// Dynamically import main components
const Dashboard = dynamic(() => import('@/components/features/dashboard/Dashboard'), {
  loading: () => <MainLoader message="Loading Dashboard..." />
})

const ContentRouter = dynamic(() => import('@/components/features/content/ContentRouter'), {
  loading: () => <MainLoader message="Loading Content..." />
})

const VideoPlayer = dynamic(() => import('@/components/features/player/VideoPlayer'), {
  loading: () => <MainLoader message="Loading Player..." />
})

const AnalyticsRouter = dynamic(() => import('@/components/features/analytics/AnalyticsRouter'), {
  loading: () => <MainLoader message="Loading Analytics..." />
})

const APIRouter = dynamic(() => import('@/components/features/apis/APIRouter'), {
  loading: () => <MainLoader message="Loading APIs..." />
})

const SettingsRouter = dynamic(() => import('@/components/features/settings/SettingsRouter'), {
  loading: () => <MainLoader message="Loading Settings..." />
})

const MainLoader = ({ message }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-300 text-sm">{message}</p>
    </div>
  </div>
)

export default function Home() {
  const { activeTab, setActiveTab } = useAppStore()

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    '1': () => setActiveTab(NAVIGATION_TABS.DASHBOARD),
    '2': () => setActiveTab(NAVIGATION_TABS.CONTENT),
    '3': () => setActiveTab(NAVIGATION_TABS.PLAYER),
    '4': () => setActiveTab(NAVIGATION_TABS.ANALYTICS),
    '5': () => setActiveTab(NAVIGATION_TABS.APIS),
    '6': () => setActiveTab(NAVIGATION_TABS.SETTINGS),
  })

  const renderContent = () => {
    const componentMap = {
      [NAVIGATION_TABS.DASHBOARD]: Dashboard,
      [NAVIGATION_TABS.CONTENT]: ContentRouter,
      [NAVIGATION_TABS.PLAYER]: VideoPlayer,
      [NAVIGATION_TABS.ANALYTICS]: AnalyticsRouter,
      [NAVIGATION_TABS.APIS]: APIRouter,
      [NAVIGATION_TABS.SETTINGS]: SettingsRouter,
    }

    const Component = componentMap[activeTab] || componentMap[NAVIGATION_TABS.DASHBOARD]

    return (
      <Suspense fallback={<MainLoader message="Loading..." />}>
        <Component />
      </Suspense>
    )
  }

  return (
    <AppLayout>
      {renderContent()}
    </AppLayout>
  )
}
