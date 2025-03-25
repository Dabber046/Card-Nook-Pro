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
      <div className="app-container">
        <nav>
          <span>🔥 Pokémon Card Tracker</span>
          <button onClick={() => setDarkMode(!darkMode)}>🌓</button>
          {token && <button onClick={logout}>Logout</button>}
        </nav>

        {!token ? (
          <div className="auth-form">
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
          </div>
        ) : (
          <div className="dashboard">
            <input
              placeholder="Add Pokémon card name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCard()}
            />
            <ul>
              {[...cards].sort((a, b) => {
                const favA = favorites.includes(a.name) ? -1 : 0;
                const favB = favorites.includes(b.name) ? -1 : 0;
                return favA - favB;
              }).map(card => (
                <li key={card.id} className={card.name.toLowerCase().includes('charizard') ? 'charizard' : ''}>
                  {card.name}
                  <span> - ${priceMap[card.name] || '...'}</span>
                  <button onClick={() => toggleFavorite(card.name)}>
                    {favorites.includes(card.name) ? '★' : '☆'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
