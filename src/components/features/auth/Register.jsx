
import React, { useState } from 'react'
import { UserPlus, Activity } from 'lucide-react'

export default function Register({ onRegister, onBack }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // No validation, just send all fields to backend
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        })
      })
      const data = await res.json()
      // Show backend message if any
      if (data.error) setError(data.error)
      if (data.message) setSuccess(data.message)
      setLoading(false)
      if (res.ok && onRegister) setTimeout(() => onRegister({ username, email }), 1000)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#1e215d]/60 via-[#2d2e6b]/60 to-[#1e215d]/60 animate-fadein">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/10 backdrop-blur-2xl border-2 border-transparent rounded-2xl p-8 w-full max-w-xs shadow-xl flex flex-col items-center glass-card min-w-0 overflow-hidden"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
      >
        <div className="absolute -inset-1 rounded-2xl pointer-events-none z-0 bg-gradient-to-br from-pink-500/40 via-purple-500/30 to-blue-400/30 blur-[2px]" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center w-full min-w-0">
          <UserPlus className="h-12 w-12 text-pink-400 mb-2 drop-shadow-lg animate-bounce-slow" />
          <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight drop-shadow">Create Account</h2>
          <p className="text-pink-200 mb-6 text-sm text-center">Register to use NTSync dashboard</p>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60 border border-white/10 focus:border-pink-400/40 transition-all shadow-sm"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60 border border-white/10 focus:border-pink-400/40 transition-all shadow-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60 border border-white/10 focus:border-pink-400/40 transition-all shadow-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60 border border-white/10 focus:border-pink-400/40 transition-all shadow-sm"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-300 mb-3 text-sm w-full text-center animate-shake">{error}</div>}
          {success && <div className="text-green-300 mb-3 text-sm w-full text-center animate-fadein">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400/60 disabled:opacity-60 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/70"></span>
                Registering...
              </span>
            ) : 'Register'}
          </button>
          <button
            type="button"
            className="w-full mt-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold shadow-md border border-white/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
            onClick={onBack}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  )
}
