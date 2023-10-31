import React from 'react';

/*
This component calculates the % of the city in the portfolio
For the moment, cities must be in the constant for this to work. In the future, I'll need to create a function to automatically search by property address.
this component calculates according to the total value of the city in the portfolio.
*/

// TODO : make a graph

function CurrencieExposition({ properties }) {

  const currencyExposure = {};

  // Iterate through each property in the list of properties
  properties.forEach((property) => {
    const currency = property.currency;

    // Check if the currency already exists in the currencyExposure object, if not, initialize it to zero
    if (!currencyExposure[currency]) {
      currencyExposure[currency] = 0;
    }

    // Calculate the value of the property by multiplying the token price by the amount
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);

    // Add the property value to the exposure of the corresponding currency
    currencyExposure[currency] += propertyValue;
  });

  // Calculate the total portfolio value
  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  return (
    <div className="currency-exposure">
      <h2>Exposition de la monnaie sur la totalité du portefeuille :</h2>
      <ul>
        {Object.keys(currencyExposure).map((currency) => (
          <li key={currency}>
            {currency}: {((currencyExposure[currency] / totalPortfolioValue) * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrencieExposition;
