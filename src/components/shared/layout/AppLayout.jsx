'use client'

import { MainNavigation, SecondaryNavigation } from '@/components/shared/navigation'
import { NotificationSystem, FloatingActionButton, ErrorBoundary } from '@/components/shared/ui'
import { KeyboardShortcutsModal } from '@/components/shared/modals'
import { PiPPlayer } from '@/components/features/player'
import { useState } from 'react'
import useAppStore from '@/lib/store/useAppStore'

export default function AppLayout({ children }) {
  const { theme } = useAppStore()
  const [showShortcuts, setShowShortcuts] = useState(false)

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-green-300 via-emerald-300 to-teal-300'
    }`}>
      <ErrorBoundary>
        {/* Main Navigation */}
        <MainNavigation />
        
        {/* Secondary Navigation */}
        <SecondaryNavigation />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Floating Components */}
        <PiPPlayer />
        <NotificationSystem />
        <FloatingActionButton />
        
        {/* Modals */}
        <KeyboardShortcutsModal 
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </ErrorBoundary>
    </div>
  )
}
