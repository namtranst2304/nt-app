import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Volume2, 
  Play, 
  Monitor, 
  Smartphone, 
  Download, 
  Bell,
  Eye,
  Shield,
  Database,
  Trash2,
  Save,
  RotateCcw,
  Globe,
  Lock,
  FileText,
  ChevronDown,
  Check,
  AlertCircle,
  HardDrive,
  Clock
} from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';
import { Button } from '@/components/shared/ui';

function Settings() {
  const {
    isDarkMode,
    toggleDarkMode,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    watchHistory,
    clearWatchHistory,
    favorites,
    clearFavorites,
    playlists,
    settings,
    updateSettings,
    videos,
    localVideos
  } = useAppStore();

  const [showConfirmClear, setShowConfirmClear] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [_showExportOptions, _setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(settings.language || 'en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];
  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
    setHasUnsavedChanges(true);
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    handleSettingChange('language', langCode);
    setShowLanguageDropdown(false);
  };

  const handleExportData = async (format) => {
    setIsExporting(true);
    try {
      const data = {
        watchHistory,
        favorites,
        playlists,
        settings,
        videos: videos.length,
        localVideos: localVideos.length,
        exportedAt: new Date().toISOString()
      };

      let content, filename, mimeType;

      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = `ntsync-data-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (format === 'csv') {
        // CSV format for watch history
        const csvData = [
          ['Title', 'Source', 'Duration', 'Progress', 'Watched At'],
          ...watchHistory.map(item => [
            item.title, 
            item.source, 
            item.duration, 
            `${item.progress}%`, 
            new Date(item.watchedAt).toLocaleDateString()
          ])
        ].map(row => row.join(',')).join('\n');
        
        content = csvData;
        filename = `ntsync-history-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'success', message: `Data exported as ${format.toUpperCase()} successfully!` }
      }));
    } catch {
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { type: 'error', message: 'Failed to export data. Please try again.' }
      }));    } finally {
      setIsExporting(false);
      // Remove setShowExportOptions since it's not needed
    }
  };
  const handleClearData = (type) => {
    switch (type) {
      case 'history':
        clearWatchHistory();
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'success', message: 'Watch history cleared successfully!' }
        }));
        break;
      case 'favorites':
        clearFavorites();
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: { type: 'success', message: 'Favorites cleared successfully!' }
        }));
        break;
      case 'cache':
        // Clear cache (localStorage cache items)
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.includes('cache') || key.includes('thumbnail')) {
              localStorage.removeItem(key);
            }
          });
          window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { type: 'success', message: 'Cache cleared successfully!' }
          }));        } catch {
          window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { type: 'error', message: 'Failed to clear cache. Please try again.' }
          }));
        }
        break;
      default:
        break;
    }
    setShowConfirmClear(null);
  };

  const resetToDefaults = () => {
    updateSettings({
      autoplay: true,
      notifications: true,
      saveProgress: true,
      highQuality: true,
      subtitles: false,
      theatreMode: false,
      keyboardShortcuts: true,
      dataSync: true
    });
    setVolume(100);
    setPlaybackRate(1);
    setHasUnsavedChanges(false);
  };

  const saveSettings = () => {
    // Settings are automatically saved via zustand store
    setHasUnsavedChanges(false);
  };  // eslint-disable-next-line no-unused-vars
  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <Icon size={24} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
      <motion.button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-400')
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          animate={{ x: checked ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
  const Slider = ({ value, onChange, min = 0, max = 100, step = 1, label, suffix = '' }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      />
    </div>
  );

  const Dropdown = ({ value, _onChange, options, label, placeholder }) => (
    <div className="space-y-2">
      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
      <div className="relative">
        <motion.button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className={`w-full p-3 rounded-lg border transition-colors flex items-center justify-between ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white hover:border-purple-500' 
              : 'bg-white border-gray-300 text-gray-900 hover:border-purple-500'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            {options.find(opt => opt.code === value)?.flag}
            <span>{options.find(opt => opt.code === value)?.name || placeholder}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
        </motion.button>
        
        {showLanguageDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={`w-full p-3 text-left flex items-center gap-2 transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-white' 
                    : 'hover:bg-gray-100 text-gray-900'
                } ${value === option.code ? 'bg-purple-500/20' : ''}`}
              >
                <span>{option.flag}</span>
                <span>{option.name}</span>
                {value === option.code && <Check size={16} className="ml-auto text-purple-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );

  const getStorageSize = () => {
    const data = {
      history: watchHistory.length,
      favorites: favorites.length,
      playlists: playlists.length
    };
    
    const totalItems = data.history + data.favorites + data.playlists;
    const estimatedMB = (totalItems * 0.1).toFixed(1); // Rough estimate
    
    return { ...data, totalItems, estimatedMB };
  };

  const storageInfo = getStorageSize();
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Customize your NTSync experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <SettingCard
          icon={isDarkMode ? Moon : Sun}
          title="Appearance"
          description="Customize the visual appearance of the application"
        >
          <div className="space-y-4">
            <Toggle
              checked={isDarkMode}
              onChange={toggleDarkMode}
              label="Dark Mode"
            />
            <Toggle
              checked={settings.theatreMode}
              onChange={(value) => handleSettingChange('theatreMode', value)}
              label="Theatre Mode"
            />
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Monitor size={16} className="text-purple-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Display Options
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Theatre mode provides a distraction-free viewing experience
              </p>
            </div>
          </div>
        </SettingCard>

        {/* Language & Region */}
        <SettingCard
          icon={Globe}
          title="Language & Region"
          description="Set your preferred language and regional settings"
        >
          <div className="space-y-4">
            <Dropdown
              value={selectedLanguage}
              _onChange={handleLanguageChange}
              options={languages}
              label="Interface Language"
              placeholder="Select Language"
            />
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-purple-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Time Format
                </span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="timeFormat" 
                    className="text-purple-500"
                    defaultChecked
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    24-hour (15:30)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="timeFormat" 
                    className="text-purple-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    12-hour (3:30 PM)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </SettingCard>        {/* Playback */}
        <SettingCard
          icon={Play}
          title="Playback"
          description="Control video playback behavior and quality"
        >
          <div className="space-y-4">
            <Slider
              value={volume}
              onChange={setVolume}
              label="Default Volume"
              suffix="%"
            />
            <Slider
              value={playbackRate}
              onChange={setPlaybackRate}
              min={0.25}
              max={2}
              step={0.25}
              label="Default Playback Speed"
              suffix="x"
            />
            <Toggle
              checked={settings.autoplay}
              onChange={(value) => handleSettingChange('autoplay', value)}
              label="Autoplay Videos"
            />
            <Toggle
              checked={settings.highQuality}
              onChange={(value) => handleSettingChange('highQuality', value)}
              label="High Quality by Default"
            />
            <Toggle
              checked={settings.subtitles}
              onChange={(value) => handleSettingChange('subtitles', value)}
              label="Show Subtitles"
            />
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={16} className="text-purple-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mobile Optimization
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Optimized settings for mobile devices are automatically applied
              </p>
            </div>
          </div>
        </SettingCard>

        {/* Privacy & Security */}
        <SettingCard
          icon={Shield}
          title="Privacy & Security"
          description="Control how your data is stored and protected"
        >
          <div className="space-y-4">
            <Toggle
              checked={settings.saveProgress}
              onChange={(value) => handleSettingChange('saveProgress', value)}
              label="Save Watch Progress"
            />
            <Toggle
              checked={settings.dataSync}
              onChange={(value) => handleSettingChange('dataSync', value)}
              label="Sync Data Across Devices"
            />
            <Toggle
              checked={settings.notifications}
              onChange={(value) => handleSettingChange('notifications', value)}
              label="Show Notifications"
            />
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-purple-500" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data Encryption
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your personal data is encrypted and stored securely
              </p>
            </div>
          </div>
        </SettingCard>

        {/* Data Export */}
        <SettingCard
          icon={Download}
          title="Data Export"
          description="Export your data for backup or migration"
        >
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Available Formats
              </h4>
              <div className="space-y-3">
                <Button
                  onClick={() => handleExportData('json')}
                  variant="secondary"
                  className="w-full justify-between"
                  disabled={isExporting}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={18} />
                    <span>Export as JSON</span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete data
                  </span>
                </Button>
                
                <Button
                  onClick={() => handleExportData('csv')}
                  variant="secondary"
                  className="w-full justify-between"
                  disabled={isExporting}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={18} />
                    <span>Export as CSV</span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Watch history
                  </span>
                </Button>
              </div>
            </div>
            
            {isExporting && (
              <div className="flex items-center gap-2 p-3 bg-purple-500/20 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                <span className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  Preparing export...
                </span>
              </div>
            )}
          </div>
        </SettingCard>        {/* Accessibility */}
        <SettingCard
          icon={Eye}
          title="Accessibility"
          description="Features to improve accessibility and usability"
        >
          <div className="space-y-4">
            <Toggle
              checked={settings.keyboardShortcuts}
              onChange={(value) => handleSettingChange('keyboardShortcuts', value)}
              label="Keyboard Shortcuts"
            />
            <Toggle
              checked={settings.reducedMotion || false}
              onChange={(value) => handleSettingChange('reducedMotion', value)}
              label="Reduce Motion"
            />
            <Toggle
              checked={settings.highContrast || false}
              onChange={(value) => handleSettingChange('highContrast', value)}
              label="High Contrast Mode"
            />
            <div className={`text-sm p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Keyboard Shortcuts:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Space - Play/Pause</div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>F - Fullscreen</div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>M - Mute</div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>P - Picture-in-Picture</div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>↑/↓ - Volume</div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>←/→ - Seek</div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Storage Management */}
        <SettingCard
          icon={Database}
          title="Storage Management"
          description="Manage your stored data and clear cache"
        >
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Storage Usage
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Watch History</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {storageInfo.history} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Favorites</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {storageInfo.favorites} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Playlists</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {storageInfo.playlists} items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Local Videos</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {localVideos.length} files
                  </span>
                </div>
                <div className={`flex justify-between border-t pt-2 mt-2 ${
                  isDarkMode ? 'border-white/10' : 'border-gray-300'
                }`}>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Estimated Size
                  </span>
                  <span className="text-purple-400 font-medium">{storageInfo.estimatedMB} MB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowConfirmClear('history')}
                variant="secondary"
                className="w-full justify-between bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
              >
                <span>Clear Watch History</span>
                <Trash2 size={18} />
              </Button>

              <Button
                onClick={() => setShowConfirmClear('favorites')}
                variant="secondary"
                className="w-full justify-between bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
              >
                <span>Clear Favorites</span>
                <Trash2 size={18} />
              </Button>

              <Button
                onClick={() => setShowConfirmClear('cache')}
                variant="secondary"
                className="w-full justify-between bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20"
              >
                <span>Clear Cache</span>
                <HardDrive size={18} />
              </Button>
            </div>

            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-blue-500" />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Storage Tips
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                Clearing cache may improve performance but will require re-downloading thumbnails
              </p>
            </div>
          </div>
        </SettingCard>        {/* Reset Settings */}
        <SettingCard
          icon={RotateCcw}
          title="Reset & Backup"
          description="Reset settings or create a backup of your preferences"
        >
          <div className="space-y-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reset all your preferences to default values. This won't affect your saved videos, playlists, or history.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={resetToDefaults}
                variant="secondary"
                className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20"
                icon={<RotateCcw size={18} />}
              >
                Reset to Defaults
              </Button>

              <Button
                onClick={() => handleExportData('json')}
                variant="secondary"
                className="w-full"
                icon={<Download size={18} />}
                disabled={isExporting}
              >
                {isExporting ? 'Creating Backup...' : 'Backup Settings'}
              </Button>
            </div>

            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-yellow-500" />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                }`}>
                  Reset Warning
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-yellow-200' : 'text-yellow-600'}`}>
                This action cannot be undone. Consider creating a backup first.
              </p>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Action Buttons */}
      <div className={`flex justify-end gap-4 mt-8 pt-6 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-300'
      }`}>
        <Button
          onClick={() => window.location.reload()}
          variant="secondary"
        >
          Cancel
        </Button>
        
        <Button
          onClick={saveSettings}
          variant={hasUnsavedChanges ? "primary" : "secondary"}
          disabled={!hasUnsavedChanges}
          icon={<Save size={20} />}
        >
          {hasUnsavedChanges ? 'Save Changes' : 'All Changes Saved'}
        </Button>
      </div>      {/* Confirmation Modal */}
      {showConfirmClear && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmClear(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle size={24} className="text-red-400" />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Clear {showConfirmClear === 'history' ? 'Watch History' : 
                      showConfirmClear === 'favorites' ? 'Favorites' : 'Cache'}?
              </h3>
            </div>
            
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {showConfirmClear === 'history' && 
                'This action cannot be undone. All your watch history will be permanently removed.'
              }
              {showConfirmClear === 'favorites' && 
                'This action cannot be undone. All your favorite videos will be permanently removed.'
              }
              {showConfirmClear === 'cache' && 
                'This will clear cached thumbnails and temporary files. This action cannot be undone.'
              }
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmClear(null)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleClearData(showConfirmClear)}
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {showConfirmClear === 'cache' ? 'Clear Cache' : 'Clear'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Settings;
