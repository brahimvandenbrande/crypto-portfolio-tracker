'use client'

import { useState, useEffect } from 'react'
import { searchCoins, fetchCryptoData } from '../utils/cryptoApi'

interface Coin {
  id: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
}

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Coin[]>([])
  const [favorites, setFavorites] = useState<Coin[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    try {
      const results = await searchCoins(searchQuery);
      if (results && results.coins) {
        setSearchResults(results.coins.slice(0, 5));
      } else {
        console.error('Unexpected API response:', results);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching coins:', error);
      setSearchResults([]);
    }
  };

  const addToFavorites = async (coin: Coin) => {
    try {
      const coinData = await fetchCryptoData(coin.id);
      if (coinData && coinData.market_data) {
        const newFavorite: Coin = {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coinData.market_data.current_price.usd,
          priceChange24h: coinData.market_data.price_change_percentage_24h,
        };
        setFavorites(prev => [...prev, newFavorite]);
        setErrorMessage(null);
      } else {
        setErrorMessage('Failed to fetch coin data. Please check your API key.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setErrorMessage('Failed to add coin to favorites. Please try again.');
    }
  };

  const removeFromFavorites = (coinId: string) => {
    setFavorites(prev => prev.filter(coin => coin.id !== coinId))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Favorite Coins</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for coins"
          className="w-full p-2 border rounded mb-2"
        />
        <button onClick={handleSearch} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map(coin => (
              <li key={coin.id} className="flex justify-between items-center border p-2 rounded">
                <span>{coin.name} ({coin.symbol})</span>
                <button
                  onClick={() => addToFavorites(coin)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Add to Favorites
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map(coin => (
          <div key={coin.id} className="border p-4 rounded">
            <h3 className="font-bold">{coin.name} ({coin.symbol})</h3>
            <p>Price: ${coin.price.toFixed(2)}</p>
            <p className={coin.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
              24h Change: {coin.priceChange24h.toFixed(2)}%
            </p>
            <button
              onClick={() => removeFromFavorites(coin.id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

