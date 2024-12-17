const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoData(coinId: string) {
  const response = await fetch(`${API_BASE_URL}/coins/${coinId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch crypto data: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function searchCoins(query: string) {
  const response = await fetch(`${API_BASE_URL}/search?query=${query}`);
  if (!response.ok) {
    throw new Error(`Failed to search coins: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCurrentPrices(coinIds: string[]) {
  const ids = coinIds.join(',');
  const response = await fetch(`${API_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd`);
  if (!response.ok) {
    throw new Error(`Failed to fetch current prices: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (Object.keys(data).length === 0) {
    throw new Error('No price data returned. Please check the cryptocurrency IDs.');
  }
  return data;
}

