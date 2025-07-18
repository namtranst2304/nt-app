# NTSync - Advanced Video Streaming Dashboard

A modern, feature-rich video streaming dashboard built with Next.js 14, designed for content creators, developers, and video enthusiasts. NTSync provides a comprehensive platform for managing, organizing, and watching videos from multiple sources.

![NTSync Logo](https://img.shields.io/badge/NTSync-Video%20Dashboard-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)

## 🚀 Live Demo

The application is running locally at: `http://localhost:3000`

## ✨ Features

### 🎥 Video Management
- **Multi-Source Support**: YouTube, Vimeo, and local video files
- **Smart Video Player**: Custom controls with keyboard shortcuts
- **Picture-in-Picture Mode**: Draggable floating player
- **Playlist Management**: Create, organize, and manage custom playlists
- **Favorites System**: Mark videos as favorites for quick access
- **Watch Later**: Save videos for future viewing

### 📊 Advanced Analytics
- **Watch Time Tracking**: Daily, weekly, and monthly statistics
- **Category Analytics**: Visual breakdown by content type
- **Device Statistics**: Track viewing across different devices
- **Popular Tags**: Most watched content categories
- **Progress Tracking**: Resume videos where you left off

### 🔍 Search & Discovery
- **Global Search**: Advanced search across videos, playlists, and history
- **Filter Options**: Search by category, duration, source, and tags
- **Real-time Results**: Instant search with live filtering
- **Search History**: Recently searched terms and suggestions

### 🎮 User Experience
- **Dual Theme System**: Dark mode and iOS-style light mode
- **Interactive Theme Toggle**: Smooth animated theme switching
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Glassmorphism Design**: Beautiful backdrop blur effects
- **Responsive Design**: Works seamlessly across all devices
- **Notifications**: Toast notifications for user feedback
- **Help System**: Built-in keyboard shortcuts guide

### 🔧 Customization
- **Theme Switching**: Toggle between dark and light modes
- **Settings Panel**: Customize playback, appearance, and behavior
- **Volume Control**: Persistent volume and mute preferences
- **Playback Speed**: Variable speed playback (0.5x to 2x)
- **Auto-play**: Configurable auto-play settings

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 + React 18
- **Styling**: Tailwind CSS 3.x with glassmorphism effects
- **Animations**: Framer Motion for smooth interactions
- **State Management**: Zustand with persistence
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **File Handling**: Native HTML5 file API

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nt-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 🎯 Key Components

### 1. Dashboard
- **Recent Videos**: Latest watched content
- **Continue Watching**: Resume interrupted videos
- **Quick Stats**: Overview of watching habits
- **Featured Playlists**: Recommended collections

### 2. Video Player
- **Full Controls**: Play/pause, volume, progress, fullscreen
- **Keyboard Navigation**: Space, arrows, number keys
- **Picture-in-Picture**: Draggable mini-player
- **Progress Tracking**: Automatic progress saving

### 3. Playlists
- **Create & Manage**: Custom playlist creation
- **Drag & Drop**: Reorder videos easily
- **Smart Thumbnails**: Auto-generated playlist covers
- **Public/Private**: Control playlist visibility

### 4. Watch History
- **Comprehensive Tracking**: All viewing activity
- **Progress Indicators**: Visual progress bars
- **Quick Actions**: Resume, remove, add to playlist
- **Search & Filter**: Find specific watched content

### 5. Statistics
- **Interactive Charts**: Visual data representation
- **Time Analytics**: Daily, weekly, monthly breakdowns
- **Category Insights**: Content type preferences
- **Device Tracking**: Multi-device usage patterns

### 6. Settings
- **Appearance**: Theme and layout preferences
- **Playback**: Default volume, speed, auto-play
- **Privacy**: History retention, data management
- **Shortcuts**: Customize keyboard bindings

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-6` | Navigate between tabs |
| `Space` | Play/Pause video |
| `←/→` | Seek backward/forward |
| `↑/↓` | Volume up/down |
| `F` | Toggle fullscreen |
| `P` | Toggle Picture-in-Picture |
| `M` | Toggle mute |
| `Ctrl+/` | Show help |
| `Esc` | Close modals |
| `Ctrl+K` | Open search |

## 🎨 Design System

### Glassmorphism Theme
- **Glass Cards**: Translucent backgrounds with backdrop blur
- **Gradient Overlays**: Purple to blue gradient accents
- **Smooth Animations**: Framer Motion micro-interactions
- **Responsive Grid**: CSS Grid and Flexbox layouts

### Color Palette
- **Primary**: Purple (`#8B5CF6`) to Blue (`#3B82F6`)
- **Background**: Dark slate (`#0F172A`)
- **Glass**: White with opacity (`rgba(255,255,255,0.1)`)
- **Text**: White (`#FFFFFF`) and Gray (`#94A3B8`)

## 📱 Responsive Design

- **Desktop**: Full-featured experience with all components
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface with essential features
- **Touch Support**: Gesture navigation and touch controls

## 🔒 Data Management

### Local Storage
- **Video Library**: Persistent video collection
- **Watch History**: Automatic tracking and storage
- **User Preferences**: Settings and customizations
- **Playlists**: Custom collections and favorites

### Privacy Features
- **History Control**: Clear or manage watch history
- **Data Export**: Export personal data and preferences
- **Retention Settings**: Configure how long data is stored
- **Incognito Mode**: Watch without history tracking

## 🚀 Performance Features

### Optimization
- **Lazy Loading**: Components load on demand
- **Virtual Scrolling**: Efficient large list rendering
- **Image Optimization**: Responsive thumbnail loading
- **Code Splitting**: Bundle optimization with Vite

### Caching
- **Video Metadata**: Cache video information locally
- **Thumbnail Caching**: Store thumbnails for offline viewing
- **Settings Persistence**: Instant preference application
- **Search Cache**: Store recent search results

## 📈 Analytics & Insights

### Watch Time Analytics
- **Daily Tracking**: Minute-by-minute watch time
- **Weekly Patterns**: Identify viewing habits
- **Monthly Trends**: Long-term usage analysis
- **Category Breakdown**: Content preference insights

### Content Analytics
- **Popular Videos**: Most watched content
- **Completion Rates**: Video engagement metrics
- **Tag Analysis**: Content category preferences
- **Device Usage**: Cross-platform viewing patterns

## 🛡️ Security & Privacy

- **No External Authentication**: Fully local application
- **Client-Side Storage**: All data stored locally
- **No Tracking**: No external analytics or tracking
- **Open Source**: Transparent and auditable code

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the in-app help (Ctrl+/)
2. Review keyboard shortcuts
3. Check browser console for errors
4. Create an issue on GitHub

## 🔮 Future Roadmap

- [ ] **Cloud Sync**: Optional cloud storage integration
- [ ] **Social Features**: Share playlists and recommendations
- [ ] **Advanced Search**: AI-powered content discovery
- [ ] **Video Editing**: Basic editing tools integration
- [ ] **Live Streaming**: Support for live video streams
- [ ] **Subtitle Support**: Automatic subtitle generation
- [ ] **Mobile App**: Native mobile applications
- [ ] **Browser Extension**: Quick video saving extension

---

**Made with ❤️ using React, Tailwind CSS, and modern web technologies**

*NTSync - Your Personal Video Universe*
