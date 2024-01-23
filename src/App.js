import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import i18n from "../src/utils/i18n.js";


import logo from './logo.svg';
import './App.css';

// router
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import About from './components/About';
import DashboardWallet from './components/DashboardWallet';

import { fetchPropertyInfo } from './requests/realt-communitary-api';
import { fetchPropertyList } from './requests/realt-communitary-api';

import { fetchGraphQLData } from './requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from './requests/rmmGraphQLRequest';
import { fetchETHGraphQLData } from './requests/ethGraphQLRequest';

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  const { i18n, t } = useTranslation();

  return (
    <Router>
      <div className="App">
        <header class="header-first">
          <nav class="nav-first">

            <div class="nav-left">
              <div className="logo">MyRealTStat</div>
              <Link to="/">Dashboard</Link>
              <Link to="/about">À propos</Link>
            </div>


            <div class="nav-right">
              <form id="search-form">
                <input
                  type="text"
                  placeholder={t("app.EnterAddress")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />

              </form>

              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

          </nav>

        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />

          <Route path="/dashboard-wallet" element={<DashboardWallet searchValue={searchValue} />} />
        </Routes>
      </div>
    </Router>
  );

}; // end app function

export default App;
