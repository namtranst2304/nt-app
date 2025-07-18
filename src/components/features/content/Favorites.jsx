'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Heart } from 'lucide-react'

export default function Favorites() {
  const favorites = [
    {
      id: 1,
      title: "React Best Practices 2024",
      thumbnail: "/api/placeholder/320/180",
      duration: "24:15",
      addedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Next.js 14 New Features",
      thumbnail: "/api/placeholder/320/180",
      duration: "18:30",
      addedDate: "1 week ago"
    },
    {
      id: 3,
      title: "CSS Grid Mastery",
      thumbnail: "/api/placeholder/320/180",
      duration: "32:45",
      addedDate: "2 weeks ago"
    },
    {
      id: 4,
      title: "TypeScript Advanced Types",
      thumbnail: "/api/placeholder/320/180",
      duration: "41:22",
      addedDate: "3 weeks ago"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Favorites
        </h2>
        <p className="text-gray-400">{favorites.length} videos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="text-6xl">🎬</div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
              <button className="absolute top-2 right-2 bg-black/70 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Added {video.addedDate}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>Favorite</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-gray-400">Start adding videos to your favorites to see them here</p>
        </div>
      )}
    </div>
  )
}
