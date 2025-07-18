'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, ExternalLink, Code, Zap, Database } from 'lucide-react'

const apiPages = [
  {
    id: 'api-1',
    title: 'API 1 - User Management',
    description: 'Test user authentication and CRUD operations',
    icon: <Database className="h-6 w-6" />,
    path: '/api/api1',
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
    features: ['User Authentication', 'CRUD Operations', 'Profile Management']
  },
  {
    id: 'api-2',
    title: 'API 2 - Content Management',
    description: 'Manage posts, articles, and content systems',
    icon: <Code className="h-6 w-6" />,
    path: '/api/api2',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-500/20 border-green-500/30',
    features: ['Content CRUD', 'Media Upload', 'Categories']
  },
  {
    id: 'api-3',
    title: 'API 3 - Analytics',
    description: 'Track events, metrics, and user analytics',
    icon: <Zap className="h-6 w-6" />,
    path: '/api/api3',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    features: ['Event Tracking', 'Metrics', 'Reports']
  },
  {
    id: 'api-4',
    title: 'API 4 - E-commerce',
    description: 'Product management and shopping cart APIs',
    icon: <ExternalLink className="h-6 w-6" />,
    path: '/api/api4',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
    features: ['Products', 'Shopping Cart', 'Orders']
  },
  {
    id: 'api-5',
    title: 'API 5 - Communication',
    description: 'Comments, messages, and notification systems',
    icon: <Play className="h-6 w-6" />,
    path: '/api/api5',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/20 border-indigo-500/30',
    features: ['Comments', 'Messages', 'Notifications']
  },
  {
    id: 'api-6',
    title: 'API 6 - Weather App',
    description: 'Weather information using WeatherStack API',
    icon: <Zap className="h-6 w-6" />,
    path: '/api/api6',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
    features: ['Current Weather', 'Location Search', 'Weather Details']
  }
]

export default function APIRouter() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          API Testing Suite
        </motion.h1>
        <motion.p 
          className="text-gray-300 text-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Test and explore different APIs with our comprehensive testing tools
        </motion.p>
      </div>

      {/* API Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiPages.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${api.bgColor} text-white`}>
                {api.icon}
              </div>
              <Link href={api.path}>
                <motion.button
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </motion.button>
              </Link>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">{api.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{api.description}</p>

            {/* Features List */}
            <div className="space-y-2 mb-6">
              {api.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Link href={api.path}>
              <motion.button
                className={`w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r ${api.color} text-white transition-all duration-200 hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open API Tester
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Start Section */}
      <motion.div
        className="mt-12 glass-card p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h3 className="text-white font-medium mb-2">Choose an API</h3>
            <p className="text-gray-300 text-sm">Select from our 6 different API testing environments</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h3 className="text-white font-medium mb-2">Configure Request</h3>
            <p className="text-gray-300 text-sm">Set up your API endpoint, method, headers, and body</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h3 className="text-white font-medium mb-2">Test & Analyze</h3>
            <p className="text-gray-300 text-sm">Send requests and analyze responses with our tools</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
