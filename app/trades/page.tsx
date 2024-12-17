'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { fetchCurrentPrices, searchCoins } from '../utils/cryptoApi'
import { Plus, X } from 'lucide-react'

interface Trade {
  id: string
  cryptocurrency: string
  cryptoId: string
  amount: number
  value: number
  currency: 'EUR' | 'USD'
  date: string
  exchange: string
  currentValue?: number
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [newTrade, setNewTrade] = useState<Omit<Trade, 'id' | 'cryptoId'>>({
    cryptocurrency: '',
    amount: 0,
    value: 0,
    currency: 'USD',
    date: '',
    exchange: '',
  })
  const [totalStackValue, setTotalStackValue] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Array<{ id: string, name: string, symbol: string }>>([])
  const [isAddingTrade, setIsAddingTrade] = useState(false)

  useEffect(() => {
    const storedTrades = localStorage.getItem('trades')
    if (storedTrades) {
      setTrades(JSON.parse(storedTrades))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades))
    updateCurrentValues()
  }, [trades])

  const updateCurrentValues = async () => {
    if (trades.length === 0) return;

    const uniqueCoins = [...new Set(trades.map(trade => trade.cryptoId))]
    try {
      setError(null)
      const prices = await fetchCurrentPrices(uniqueCoins)
      const updatedTrades = trades.map(trade => ({
        ...trade,
        currentValue: trade.amount * (prices[trade.cryptoId]?.usd || 0)
      }))
      setTrades(updatedTrades)
      const total = updatedTrades.reduce((sum, trade) => sum + (trade.currentValue || 0), 0)
      setTotalStackValue(total)
    } catch (error) {
      console.error('Error fetching current prices:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTrade(prev => ({ ...prev, [name]: name === 'amount' || name === 'value' ? parseFloat(value) : value }))

    if (name === 'cryptocurrency' && value.length > 2) {
      try {
        const results = await searchCoins(value)
        setSearchResults(results.coins.slice(0, 5))
      } catch (error) {
        console.error('Error searching coins:', error)
      }
    }
  }

  const handleCryptoSelect = (coin: { id: string, name: string, symbol: string }) => {
    setNewTrade(prev => ({ ...prev, cryptocurrency: coin.name }))
    setSearchResults([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedCoin = searchResults.find(coin => coin.name === newTrade.cryptocurrency)
    if (!selectedCoin) {
      setError('Please select a valid cryptocurrency from the search results.')
      return
    }
    const trade: Trade = { ...newTrade, id: uuidv4(), cryptoId: selectedCoin.id }
    setTrades(prev => [...prev, trade])
    setNewTrade({
      cryptocurrency: '',
      amount: 0,
      value: 0,
      currency: 'USD',
      date: '',
      exchange: '',
    })
    setSearchResults([])
    setIsAddingTrade(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-[#37352f] dark:text-white">Trades</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          Error: {error}
        </div>
      )}
      {isAddingTrade ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-[#f7f7f7] dark:bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-[#37352f] dark:text-white">Add New Trade</h2>
            <button
              type="button"
              onClick={() => setIsAddingTrade(false)}
              className="text-[#787774] dark:text-gray-300 hover:text-[#37352f] dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="cryptocurrency" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Cryptocurrency</label>
              <input
                type="text"
                id="cryptocurrency"
                name="cryptocurrency"
                value={newTrade.cryptocurrency}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-[#e9e9e8] dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                  {searchResults.map(coin => (
                    <li
                      key={coin.id}
                      className="p-2 hover:bg-[#f7f7f7] dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleCryptoSelect(coin)}
                    >
                      {coin.name} ({coin.symbol})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newTrade.amount}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Transaction Value</label>
              <input
                type="number"
                id="value"
                name="value"
                value={newTrade.value}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Currency</label>
              <select
                id="currency"
                name="currency"
                value={newTrade.currency}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newTrade.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="exchange" className="block text-sm font-medium text-[#787774] dark:text-gray-300 mb-1">Exchange</label>
              <input
                type="text"
                id="exchange"
                name="exchange"
                value={newTrade.exchange}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#e9e9e8] dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#0077ff] dark:focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full bg-[#0077ff] dark:bg-blue-500 text-white p-2 rounded-md hover:bg-[#0066dd] dark:hover:bg-blue-700 transition-colors">
            Add Trade
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingTrade(true)}
          className="mb-8 flex items-center space-x-2 text-[#0077ff] dark:text-blue-500 hover:text-[#0066dd] dark:hover:text-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Trade</span>
        </button>
      )}

      <div className="mb-8 bg-[#f7f7f7] dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2 text-[#37352f] dark:text-white">Total Stack Value</h2>
        <p className="text-3xl font-bold text-[#0077ff] dark:text-blue-500">${totalStackValue.toFixed(2)}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-[#37352f] dark:text-white">Recent Trades</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-[#e9e9e8] dark:border-gray-600 rounded-lg">
        <table className="min-w-full divide-y divide-[#e9e9e8] dark:divide-gray-600">
          <thead className="bg-[#f7f7f7] dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Cryptocurrency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Value at Purchase</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Current Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-gray-300 uppercase tracking-wider">Exchange</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-[#e9e9e8] dark:divide-gray-600">
            {trades.map(trade => (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap">{trade.cryptocurrency}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.value} {trade.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap">${trade.currentValue?.toFixed(2) || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.exchange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
