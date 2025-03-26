import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [priceMap, setPriceMap] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    if (token) fetchCards();
  }, [token]);

  const login = async () => {
    const res = await axios.post('http://localhost:3000/api/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async () => {
    await axios.post('http://localhost:3000/api/register', { email, password });
    login();
  };

  const fetchCards = async () => {
    const res = await api.get('/cards');
    setCards(res.data);
    res.data.forEach(card => fetchPrice(card.name));
  };

  const fetchPrice = async (name) => {
    const res = await api.get(`/price/${name}`);
    setPriceMap(prev => ({ ...prev, [name]: res.data.price }));
  };

  const addCard = async () => {
    await api.post('/cards', { name: cardName });
    setCardName('');
    fetchCards();
  };

  const toggleFavorite = (name) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCards([]);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500 p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-300">🔥 Pokémon Card Tracker</h1>
            <div className="flex gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="bg-purple-500 text-white px-2 py-1 rounded-full shadow hover:bg-purple-600 transition">
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              {token && (
                <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition">
                  Logout
                </button>
              )}
            </div>
          </nav>

          {!token ? (
            <div className="space-y-4">
              <input className="w-full p-3 rounded border border-gray-300" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full p-3 rounded border border-gray-300" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="flex gap-4">
                <button onClick={login} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Login</button>
                <button onClick={register} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">Register</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <input
                  className="flex-1 p-3 rounded-lg border border-gray-300"
                  placeholder="Add Pokémon card name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCard()}
                />
                <button onClick={addCard} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Add Card</button>
              </div>

              <h2 className="text-xl font-semibold text-pink-700 dark:text-pink-300">My Cards</h2>
              <ul className="space-y-4">
                {[...cards].sort((a, b) => {
                  const favA = favorites.includes(a.name) ? -1 : 0;
                  const favB = favorites.includes(b.name) ? -1 : 0;
                  return favA - favB;
                }).map(card => (
                  <li
                    key={card.id}
                    className={`
                      flex justify-between items-center p-4 rounded-xl shadow-md
                      ${card.name.toLowerCase().includes('charizard')
                        ? 'bg-orange-200 border-2 border-orange-500 animate-pulse font-bold text-orange-900'
                        : 'bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-gray-700 dark:to-gray-600'}
                    `}
                  >
                    <span>{card.name}</span>
                    <div className="flex gap-3 items-center">
                      <span className="font-semibold">${priceMap[card.name] || '...'}</span>
                      <button
                        onClick={() => toggleFavorite(card.name)}
                        className="text-xl"
                      >
                        {favorites.includes(card.name) ? '⭐' : '☆'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;