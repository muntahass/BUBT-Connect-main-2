import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { dummyConnectionsData } from '../assets/assets'
import UserCard from '../components/UserCard'

const Discover = () => {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState(dummyConnectionsData)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 🔍 Live suggestions
  useEffect(() => {
    if (input.trim() === '') {
      setSuggestions([])
      return
    }

    const term = input.toLowerCase()
    const filtered = dummyConnectionsData.filter(
      (user) =>
        user.full_name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.bio?.toLowerCase().includes(term)
    )
    setSuggestions(filtered.slice(0, 5))
  }, [input])

  // 🕐 Search on Enter
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true)
      setShowSuggestions(false)

      setTimeout(() => {
        const searchTerm = input.toLowerCase()
        const filtered = dummyConnectionsData.filter(
          (user) =>
            user.full_name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.bio?.toLowerCase().includes(searchTerm)
        )
        setUsers(filtered)
        setLoading(false)
      }, 1000)
    }
  }

  // 🖱️ Click suggestion
  const handleSuggestionClick = (name) => {
    setInput(name)
    setShowSuggestions(false)
    setLoading(true)

    // Optional: simulate immediate search
    setTimeout(() => {
      const searchTerm = name.toLowerCase()
      const filtered = dummyConnectionsData.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.bio?.toLowerCase().includes(searchTerm)
      )
      setUsers(filtered)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">🔎 Discover People</h1>
          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80 relative">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name, username, bio, or location..."
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setInput(e.target.value)
                  setShowSuggestions(true)
                }}
                onKeyDown={handleSearch}
                value={input}
              />

              {/* Suggestion Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  {suggestions.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleSuggestionClick(user.full_name)}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                    >
                      <img
                        src={user.profile_picture}
                        alt={user.full_name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-wrap gap-6">
          {loading ? (
            <p className="text-slate-600 animate-pulse">Searching...</p>
          ) : users.length > 0 ? (
            users.map((user) => <UserCard key={user._id} user={user} />)
          ) : (
            <p className="text-slate-500 italic">No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discover
