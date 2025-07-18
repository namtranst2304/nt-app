'use client'

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, Bell, User, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import useAppStore from '@/lib/store/useAppStore';
import SearchModal from '../modals/SearchModal';
import { ThemeToggle } from '@/components/shared/ui';

const TopNav = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const showShortcuts = () => {
    window.dispatchEvent(new CustomEvent('show-shortcuts'));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'player', label: 'Video Player' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'watchlater', label: 'Watch Later' },
    { id: 'stats', label: 'Statistics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <>
      <motion.div 
        className="glass-card mx-6 mt-6 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10"/>              
              <input
                type="text"
                placeholder="Search videos, playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchModalOpen(true)}
                className="input-glass w-full pl-10 pr-4 py-2 transition-all"
              />
            </div>
          </div>              {/* Navigation Tabs */}
          <div className="nav-tab-container flex items-center gap-1 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>{/* Right Actions */}          <div className="flex items-center gap-3">
            {/* Help Button */}
            <button
              onClick={showShortcuts}
              className="btn-glass p-2 rounded-lg"
              title="Keyboard Shortcuts (Ctrl + /)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="btn-glass p-2 rounded-lg relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </button>

            {/* User Profile */}
            <button className="btn-glass p-2 rounded-lg">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery('');
        }}
      />
    </>
  );
};

export default TopNav;
