'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Save, Copy, Download } from 'lucide-react'
import Link from 'next/link'
import { userAPI } from '@/lib/api'

export default function API1Page() {
  const [url, setUrl] = useState('users')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      let result
      const requestBody = body ? JSON.parse(body) : undefined
      
      switch (method) {
        case 'GET':
          if (url === 'users') {
            result = await userAPI.getUsers()
          } else if (url.startsWith('users/')) {
            const id = url.split('/')[1]
            result = await userAPI.getUser(id)
          } else {
            // Fallback to direct API call
            result = await fetch(`http://localhost:8080/api/v1/${url}`, {
              method: 'GET',
              headers: JSON.parse(headers)
            }).then(res => res.json())
          }
          break
        case 'POST':
          if (url === 'users') {
            result = await userAPI.createUser(requestBody)
          } else if (url === 'auth/register') {
            result = await userAPI.register(requestBody)
          } else if (url === 'auth/login') {
            result = await userAPI.login(requestBody)
          } else {
            // Fallback to direct API call
            result = await fetch(`http://localhost:8080/api/v1/${url}`, {
              method: 'POST',
              headers: JSON.parse(headers),
              body: JSON.stringify(requestBody)
            }).then(res => res.json())
          }
          break
        case 'PUT':
          if (url.startsWith('users/')) {
            const id = url.split('/')[1]
            result = await userAPI.updateUser(id, requestBody)
          } else {
            // Fallback to direct API call
            result = await fetch(`http://localhost:8080/api/v1/${url}`, {
              method: 'PUT',
              headers: JSON.parse(headers),
              body: JSON.stringify(requestBody)
            }).then(res => res.json())
          }
          break
        case 'DELETE':
          if (url.startsWith('users/')) {
            const id = url.split('/')[1]
            result = await userAPI.deleteUser(id)
          } else {
            // Fallback to direct API call
            result = await fetch(`http://localhost:8080/api/v1/${url}`, {
              method: 'DELETE',
              headers: JSON.parse(headers)
            }).then(res => res.json())
          }
          break
        default:
          throw new Error('Unsupported method')
      }
      
      setResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setResponse(JSON.stringify({
        error: error.message,
        details: error.toString()
      }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    const apiData = { url, method, headers, body, response }
    localStorage.setItem('ntsync-api-1', JSON.stringify(apiData))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
  }

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-1-response-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">API 1 Testing</h1>
              <p className="text-gray-300">Full-featured API testing environment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                saved ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{saved ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Request Configuration</h2>
              
              <div className="space-y-4">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">API URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Method and Headers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Status</label>
                    <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg">
                      <span className="text-green-400 text-sm">● Ready</span>
                    </div>
                  </div>
                </div>

                {/* Headers */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Headers (JSON)</label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none font-mono text-sm"
                  />
                </div>

                {/* Request Body */}
                {method !== 'GET' && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Request Body</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none font-mono text-sm"
                    />
                  </div>
                )}

                {/* Test Button */}
                <button
                  onClick={handleTest}
                  disabled={loading || !url}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    loading || !url 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}
                >
                  {loading ? 'Testing API...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Response</h2>
                {response && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              
              {response ? (
                <pre className="bg-gray-800 p-4 rounded-lg text-green-400 text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  {response}
                </pre>
              ) : (
                <div className="bg-gray-800 p-4 rounded-lg text-gray-400 text-center">
                  <p>No response yet. Send a request to see the response here.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setUrl('users')
                    setMethod('GET')
                  }}
                  className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  Get Users
                </button>
                <button 
                  onClick={() => {
                    setUrl('users')
                    setMethod('POST')
                    setBody('{"username": "john_doe", "email": "john@example.com", "password": "password123", "firstName": "John", "lastName": "Doe"}')
                  }}
                  className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  Create User
                </button>
                <button 
                  onClick={() => {
                    setUrl('auth/register')
                    setMethod('POST')
                    setBody('{"username": "jane_doe", "email": "jane@example.com", "password": "password123", "firstName": "Jane", "lastName": "Doe"}')
                  }}
                  className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors"
                >
                  Register
                </button>
                <button 
                  onClick={() => {
                    setUrl('auth/login')
                    setMethod('POST')
                    setBody('{"email": "john@example.com", "password": "password123"}')
                  }}
                  className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setUrl('users')
                    setMethod('GET')
                    setHeaders('{"Content-Type": "application/json"}')
                    setBody('')
                    setResponse('')
                  }}
                  className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setResponse('')}
                  className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Clear Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
