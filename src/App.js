import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import fetchRealTData from './requests/realt-communitary-api';
import { fetchGraphQLData } from './requests/xdaiGraphQLRequest'; // Assurez-vous que le chemin est correct

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const searchData = await fetchGraphQLData(searchValue);
      setSearchResults(searchData);
    } catch (error) {
      console.error('Erreur lors de la recherche sur TheGraph :', error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Entrez une adresse"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {/* Afficher les résultats de la recherche */}
      {searchResults && (
        <div className="search-results">
          <h2>Résultats de la recherche :</h2>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </div>
      )}

      {/* Afficher les données de l'API RealT */}
      {data && (
        <div className="data-container">
          <h2>Données de l'API RealT :</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
