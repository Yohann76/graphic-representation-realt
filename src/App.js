import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

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

  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  const { i18n, t } = useTranslation();

  // try find many wallet
  const [walletAddresses, setWalletAddresses] = useState(['']); // array wallet
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWalletChange = (index, value) => {
  const newWallets = [...walletAddresses];
    newWallets[index] = value;
    setWalletAddresses(newWallets);
  };

  const addWalletField = () => {
    setWalletAddresses([...walletAddresses, '']);
  };

  const removeWalletField = index => {
    const newWallets = walletAddresses.filter((_, i) => i !== index);
    setWalletAddresses(newWallets);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // end try find many wallet


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

              <button onClick={openModal}>Gérer les Wallets</button>

              <ReactModal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Gestion des Wallets">
                <h2>Gérer les Wallets</h2>
                {walletAddresses.map((address, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder={t("app.EnterAddress")}
                      value={address}
                      onChange={(e) => handleWalletChange(index, e.target.value)}
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => removeWalletField(index)}>
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addWalletField}>Ajouter un autre Wallet</button>
                <button onClick={closeModal}>Fermer</button>
              </ReactModal>

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

          <Route path="/dashboard-wallet" element={<DashboardWallet walletAddresses={walletAddresses} />} />
        </Routes>
      </div>
    </Router>
  );

}; // end app function

export default App;
