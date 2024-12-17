'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Load existing settings
    const storedApiKey = localStorage.getItem('cryptoApiKey') || ''
    
    setApiKey(storedApiKey)
  }, [])

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('cryptoApiKey', apiKey)
    alert('API Key updated successfully!')
  }

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your trades and favorites.')) {
      localStorage.removeItem('trades')
      localStorage.removeItem('favorites')
      alert('All data has been cleared.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* API Key Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">API Key</h2>
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <input 
            type="text" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your crypto API key"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Save API Key
          </button>
        </form>
      </section>

      {/* Clear Data Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
        <button 
          onClick={handleClearData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
        >
          Clear All Data
        </button>
      </section>
    </div>
  )
}