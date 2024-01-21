import React from 'react';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

// Todo : get props/info from form in navbar and return data for wallet graphic
const DashboardWallet = () => {
  return (
    <div className="App">
      <header class="header-second">
        <nav class="nav-second">
          <Link to="/">RealT Statistique</Link>
          <Link to="/dashboard-wallet">Wallet Statistique</Link>
       </nav>
     </header>

     <h1>Stats wallet, get info from props for display graph link data realt</h1>

   </div>
  );
};

export default DashboardWallet;
