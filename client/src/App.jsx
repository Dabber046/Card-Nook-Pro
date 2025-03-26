import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './index.css';

function Navbar({ darkMode, setDarkMode, token, logout }) {
  return (
    <nav className="bg-black text-orange-400 px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold neon-orange">🔥 Pokémon Tracker</div>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-orange-300 transition">Home</Link>
        {token && <Link to="/dashboard" className="hover:text-orange-300 transition">Dashboard</Link>}
        {!token && <Link to="/login" className="hover:text-orange-300 transition">Login</Link>}
        <button onClick={() => setDarkMode(!darkMode)} className="bg-orange-500 text-white px-3 py-1 rounded-lg shadow">
          {darkMode ? '☀️' : '🌙'}
        </button>
        {token && (
          <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded-lg">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Pokémon Card Tracker</h1>
      <p className="text-lg">Log in or register to start tracking your cards!</p>
    </div>
  );
}

function LoginRegister({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await axios.post('http://localhost:3000/api/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async () => {
    await axios.post('http://localhost:3000/api/register', { email, password });
    login();
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">Login or Register</h2>
      <input
        className="w-full p-2 rounded border"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 rounded border"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={login} className="flex-1 bg-blue-500 text-white p-2 rounded">Login</button>
        <button onClick={register} className="flex-1 bg-green-500 text-white p-2 rounded">Register</button>
      </div>
    </div>
  );
}

function Dashboard({ token }) {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [priceMap, setPriceMap] = useState({});
  const [favorites, setFavorites] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

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
    if (!cardName) return;
    await api.post('/cards', { name: cardName });
    setCardName('');
    fetchCards();
  };

  const toggleFavorite = (name) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    if (token) fetchCards();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <input
        placeholder="Add a Pokémon card"
        value={cardName}
        onChange={e => setCardName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addCard()}
        className="w-full p-3 border rounded-lg"
      />
      <ul className="space-y-3">
        {cards.sort((a, b) => favorites.includes(b.name) - favorites.includes(a.name)).map(card => (
          <li
            key={card.id}
            className={`p-4 rounded-xl shadow flex justify-between items-center ${
              card.name.toLowerCase().includes('charizard')
                ? 'bg-orange-200 border-2 border-orange-500 animate-pulse font-bold text-orange-900'
                : 'bg-gradient-to-r from-pink-100 to-purple-100 dark:from-gray-700 dark:to-gray-600'
            }`}
          >
            <span>{card.name}</span>
            <div className="flex gap-3 items-center">
              <span className="font-semibold">${priceMap[card.name] || '...'}</span>
              <button onClick={() => toggleFavorite(card.name)}>
                {favorites.includes(card.name) ? '⭐' : '☆'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} token={token} logout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginRegister setToken={setToken} />} />
          <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;