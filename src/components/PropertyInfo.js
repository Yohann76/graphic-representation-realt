import React from 'react';
import { formatNumberWithSpaces } from '../utils/numberUtils';

function PropertyInfo({ propertyInfo }) {

  propertyInfo.forEach((property) => {
    // Calculate price per door
    if (property.totalUnits > 1) {
      property.pricePerDoor = (property.totalInvestment / property.totalUnits).toFixed(2);
    } else {
      property.pricePerDoor = '-';
    }
    // calculate price per sqft (interior) (TODO later : transform sqft -> m2)
    if (property.squareFeet) {
      property.pricePerSqft = (property.totalInvestment / property.squareFeet).toFixed(2);
    } else {
      property.pricePerSqft = '-';
    }
  });

  return (
    <div className="property-info-container section">
      <h2 class="title-property-info">Property information :</h2>
      <table>
        <thead>
          <tr>
            <th>Contract address</th>
            <th>Property name</th>
            <th>Token price</th>
            <th>Number of tokens</th>
            <th>Price per door</th>
            <th>Price per sqft</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {propertyInfo.map((property, index) => (
            <tr>
              <td>{property.uuid}</td>
              <td>{property.fullName}</td>
              <td>{property.tokenPrice}</td>
              <td>{formatNumberWithSpaces(property.amount)}</td>
              <td>{formatNumberWithSpaces(property.pricePerDoor)}</td>
              <td>{formatNumberWithSpaces(property.pricePerSqft)}</td>
              <td>{formatNumberWithSpaces(property.totalValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyInfo;
