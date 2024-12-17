'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you'd want to encrypt this before storing
    localStorage.setItem('cryptoApiKey', apiKey)
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Set API Key</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block mb-2">API Key (e.g., CoinGecko)</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Save API Key
        </button>
      </form>
    </div>
  )
}

