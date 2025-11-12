import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const response = await fetch(`http://localhost:3001/api/suggestions?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setResults([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wyszukiwarka Produktów</h1>
        <div className="search-container">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Wyszukaj produkty..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? 'Szukam...' : 'Szukaj'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="results-container">
            <h2>Wyniki wyszukiwania:</h2>
            <div className="results-grid">
              {results.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p><strong>Kategoria:</strong> {product.category}</p>
                  <p><strong>Cena:</strong> {product.price} PLN</p>
                  <p><strong>Ilość:</strong> {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
