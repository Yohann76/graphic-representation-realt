import React from 'react';
import { formatNumberWithSpaces, formatNumberWithSpacesAndWithoutvirgul } from '../utils/numberUtils';

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

    // Calculate percentage of rented units
    if (property.totalUnits > 0) {
      property.percentageRentedUnits = Math.round((property.rentedUnits / property.totalUnits) * 100);
    } else {
      property.percentageRentedUnits = '-';
    }
  });

  return (
    <div className="property-info-container section">
      <h2 class="title-property-info">Property information :</h2>
      <table>
        <thead>
          <tr>
            <th>Property name</th>
            <th>Contract address</th>
            <th>Token price</th>
            <th>Rented Units</th>
            <th>Number of tokens</th>
            <th>Price per door</th>
            <th>Price per sqft</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {propertyInfo.map((property, index) => (
            <tr>
              <td>{property.fullName}</td>
              <td>    
                <a href={`https://gnosis.blockscout.com/token/${property.uuid}`} target="_blank">
                    {property.uuid}
                </a>
              </td>
              <td>{property.tokenPrice} $</td>
              <td>{property.rentedUnits}/{property.totalUnits} ({property.percentageRentedUnits}%)</td>
              <td>{property.amount}</td>
              <td>{formatNumberWithSpacesAndWithoutvirgul(property.pricePerDoor)} {property.pricePerDoor !== '-' ? '$' : ''}</td>
              <td>{formatNumberWithSpacesAndWithoutvirgul(property.pricePerSqft)} $</td>
              <td>{formatNumberWithSpaces(property.totalValue)} $</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyInfo;
