'use client'

import { motion } from 'framer-motion'
import { FolderOpen, Play, Clock, Plus } from 'lucide-react'

export default function Library() {
  const categories = [
    {
      name: "Programming",
      count: 45,
      icon: "💻",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      name: "Design",
      count: 23,
      icon: "🎨",
      color: "from-pink-500/20 to-red-500/20"
    },
    {
      name: "Music",
      count: 67,
      icon: "🎵",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      name: "Learning",
      count: 34,
      icon: "📚",
      color: "from-yellow-500/20 to-orange-500/20"
    }
  ]

  const recentlyAdded = [
    {
      id: 1,
      title: "Advanced React Patterns",
      category: "Programming",
      duration: "28:45",
      addedDate: "Today"
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      category: "Design",
      duration: "15:32",
      addedDate: "Yesterday"
    },
    {
      id: 3,
      title: "Node.js Performance Tips",
      category: "Programming",
      duration: "19:20",
      addedDate: "2 days ago"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-blue-500" />
          Library
        </h2>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${category.color} hover:scale-105 transition-transform duration-300 cursor-pointer`}
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h4 className="font-semibold text-white mb-1">{category.name}</h4>
              <p className="text-sm text-gray-300">{category.count} videos</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recently Added</h3>
        <div className="glass-card rounded-2xl overflow-hidden">
          {recentlyAdded.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-700 last:border-b-0"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{video.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{video.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </span>
                  <span>Added {video.addedDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <h4 className="text-sm text-gray-400 mb-2">Total Videos</h4>
          <p className="text-3xl font-bold text-white">169</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h4 className="text-sm text-gray-400 mb-2">Total Duration</h4>
          <p className="text-3xl font-bold text-white">45h 23m</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h4 className="text-sm text-gray-400 mb-2">Categories</h4>
          <p className="text-3xl font-bold text-white">{categories.length}</p>
        </div>
      </div>
    </div>
  )
}
