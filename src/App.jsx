import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrypto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
      );
      if (!response.ok) throw new Error('Failed to fetch data. Try again in a moment.');
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrypto();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>Live Crypto Tracker</h1>
        <button onClick={fetchCrypto} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Prices'}
        </button>
      </header>

      <input
        type="text"
        placeholder="Search coin (e.g., Bitcoin, ETH)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="status">Loading live market data...</p>
      ) : (
        <div className="grid">
          {filteredCoins.map((coin) => (
            <div key={coin.id} className="card">
              <div className="card-header">
                <img src={coin.image} alt={coin.name} width="32" height="32" />
                <div>
                  <h2>{coin.name}</h2>
                  <span>{coin.symbol.toUpperCase()}</span>
                </div>
              </div>
              <p className="price">${coin.current_price.toLocaleString()}</p>
              <p className={coin.price_change_percentage_24h >= 0 ? 'green' : 'red'}>
                {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}