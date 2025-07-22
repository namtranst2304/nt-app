import React, { useState } from 'react'
import { Activity, UserPlus, LogIn, Mail } from 'lucide-react'

export default function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!username || !password) {
      setError('Please enter username and password')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      setLoading(false)
      onLogin(data.user)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#1e215d]/60 via-[#2d2e6b]/60 to-[#1e215d]/60 animate-fadein">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/10 backdrop-blur-2xl border-2 border-transparent rounded-2xl p-8 w-full max-w-xs shadow-xl flex flex-col items-center glass-card"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-1 rounded-2xl pointer-events-none z-0 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-400/30 blur-[2px]" />
        <div className="relative z-10 flex flex-col items-center w-full">
          <Activity className="h-12 w-12 text-blue-400 mb-2 drop-shadow-lg animate-bounce-slow" />
          <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight drop-shadow">Welcome to NT</h2>
          <p className="text-blue-200 mb-6 text-sm text-center">Sign in to your NTSync dashboard</p>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 border border-white/10 focus:border-blue-400/40 transition-all shadow-sm"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 border border-white/10 focus:border-blue-400/40 transition-all shadow-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-300 mb-3 text-sm w-full text-center animate-shake">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/60 disabled:opacity-60 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/70"></span>
                Signing in...
              </span>
            ) : 'Login'}
          </button>
          {/* Register and Google login buttons */}
          <div className="flex flex-col gap-2 w-full mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400/60"
              tabIndex={-1}
              onClick={onShowRegister}
            >
              <UserPlus className="h-5 w-5 text-white" />
              Register
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold shadow-md border border-white/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
              tabIndex={-1}
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none"><g clipPath="url(#clip0_17_40)"><path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24.5V29H37.4C36.8 32.1 34.7 34.6 31.7 36.2V42H39.2C44 38.1 47.5 32 47.5 24.5Z" fill="#4285F4"/><path d="M24.5 47C31.1 47 36.6 44.8 39.2 42L31.7 36.2C30.2 37.2 28.3 37.8 24.5 37.8C18.1 37.8 12.7 33.7 10.8 28.1H3.1V33.1C6.7 40.1 14.8 47 24.5 47Z" fill="#34A853"/><path d="M10.8 28.1C10.3 27.1 10 26 10 25C10 24 10.3 22.9 10.8 21.9V16.9H3.1C1.7 19.6 1 22.2 1 25C1 27.8 1.7 30.4 3.1 33.1L10.8 28.1Z" fill="#FBBC05"/><path d="M24.5 12.2C28.1 12.2 30.5 13.7 32 15.1L39.3 8.1C36.6 5.6 31.1 3 24.5 3C14.8 3 6.7 9.9 3.1 16.9L10.8 21.9C12.7 16.3 18.1 12.2 24.5 12.2Z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>
              Login with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
