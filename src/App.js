import React, { useEffect, useState } from 'react';
import fetchRealTData from './RealTData'; // Importez la fonction de récupération de données

import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Appel à la fonction pour récupérer les données de l'API RealT
    fetchRealTData()
      .then((apiData) => {
        // Mettez à jour l'état avec les données récupérées
        setData(apiData);
      })
      .catch((error) => {
        // Gérez les erreurs ici
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          RealT Graphique Dashboard
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* Affichez les données ici */}
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
