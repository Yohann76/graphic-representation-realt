import React from 'react';

/*
This component calculates the % of the city in the portfolio
For the moment, cities must be in the constant for this to work. In the future, I'll need to create a function to automatically search by property address.
this component calculates according to the total value of the city in the portfolio.
*/

// TODO : make a graph

function PropertyPercentage({ properties }) {
  const cities = ['Detroit', 'Montgomery', 'Chicago', 'Cleveland', 'Los Santos', 'Covington', 'Toledo', 'Rochester', 'Highland Park'  ];

  const cityValues = cities.reduce((values, city) => {
    values[city] = 0;
    return values;
  }, {});

  properties.forEach((property) => {
    const fullName = property.fullName.toLowerCase();
    cities.forEach((city) => {
      if (fullName.includes(city.toLowerCase())) {
        const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
        cityValues[city] += propertyValue;
      }
    });
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  return (
    <div className="property-percentage">
      <h2>Pourcentage de la valeur du portefeuille par ville :</h2>
      <ul>
        {cities.map((city) => (
          <li key={city}>
            {city}: {((cityValues[city] / totalPortfolioValue) * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PropertyPercentage;
