'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import useAppStore from '@/lib/store/useAppStore'
import { CONTENT_SUBTABS } from '@/constants'

// Dynamically import content components
const Playlists = dynamic(() => import('@/components/features/content/Playlists'), {
  loading: () => <ContentLoader message="Loading Playlists..." />
})

const History = dynamic(() => import('@/components/features/content/History'), {
  loading: () => <ContentLoader message="Loading History..." />
})

const Favorites = dynamic(() => import('@/components/features/content/Favorites'), {
  loading: () => <ContentLoader message="Loading Favorites..." />
})

const Library = dynamic(() => import('@/components/features/content/Library'), {
  loading: () => <ContentLoader message="Loading Library..." />
})

const ContentLoader = ({ message }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  </div>
)

export default function ContentRouter() {
  const { activeSubTab } = useAppStore()

  const renderContent = () => {
    const componentMap = {
      [CONTENT_SUBTABS.PLAYLISTS]: Playlists,
      [CONTENT_SUBTABS.HISTORY]: History,
      [CONTENT_SUBTABS.FAVORITES]: Favorites,
      [CONTENT_SUBTABS.LIBRARY]: Library,
    }

    const Component = componentMap[activeSubTab] || componentMap[CONTENT_SUBTABS.PLAYLISTS]

    return (
      <Suspense fallback={<ContentLoader message="Loading..." />}>
        <Component />
      </Suspense>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {renderContent()}
    </div>
  )
}
