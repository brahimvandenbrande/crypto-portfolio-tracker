'use client'

import { useState, useEffect } from 'react'
import { fetchCurrentPrices } from '../utils/cryptoApi'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

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

export default function PortfolioPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedTrades = localStorage.getItem('trades')
    if (storedTrades) {
      setTrades(JSON.parse(storedTrades))
    }
  }, [])

  useEffect(() => {
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
      setTotalValue(total)
    } catch (error) {
      console.error('Error fetching current prices:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  const aggregatedHoldings = trades.reduce((acc, trade) => {
    if (!acc[trade.cryptocurrency]) {
      acc[trade.cryptocurrency] = {
        amount: 0,
        value: 0,
      }
    }
    acc[trade.cryptocurrency].amount += trade.amount
    acc[trade.cryptocurrency].value += trade.currentValue || 0
    return acc
  }, {} as Record<string, { amount: number; value: number }>)

  const chartData = {
    labels: Object.keys(aggregatedHoldings),
    datasets: [
      {
        data: Object.values(aggregatedHoldings).map(h => h.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Distribution',
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-[#37352f] dark:text-white">Your Portfolio</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-gray-800 dark:text-white">
          Error: {error}
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#37352f] dark:text-white">Total Portfolio Value</h2>
          <p className="text-3xl font-bold text-[#37352f] dark:text-white">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#37352f] dark:text-white">Holdings</h2>
            <div className="bg-white dark:bg-gray-800 border border-[#e9e9e8] dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-[#e9e9e8] dark:divide-gray-700">
                <thead className="bg-[#f7f7f7] dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-white uppercase tracking-wider">Cryptocurrency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-white uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#787774] dark:text-white uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-[#e9e9e8] dark:divide-gray-700">
                  {Object.entries(aggregatedHoldings).map(([crypto, holding]) => (
                    <tr key={crypto}>
                      <td className="px-6 py-4 whitespace-nowrap text-[#37352f] dark:text-white">{crypto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#37352f] dark:text-white">{holding.amount.toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#37352f] dark:text-white">${holding.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#37352f] dark:text-white">Portfolio Distribution</h2>
            <div className="bg-white dark:bg-gray-800 border border-[#e9e9e8] dark:border-gray-700 rounded-lg p-4">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
