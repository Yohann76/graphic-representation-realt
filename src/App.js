import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import i18n from "../src/utils/i18n.js";


import logo from './logo.svg';
import './App.css';

// router
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import About from './components/About';

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  return (
    <Router>
    <div className="App">
      <header>
        <nav>
          <div className="logo">MyRealTStat</div>
          <Link to="/">Dashboard</Link>
          <Link to="/about">À propos</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  </Router>
  );

}; // end app function

export default App;
