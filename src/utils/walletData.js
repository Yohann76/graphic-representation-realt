import { fetchPropertyInfo } from '../requests/realt-communitary-api';
import { fetchPropertyList } from '../requests/realt-communitary-api';

import { fetchGraphQLData } from '../requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from '../requests/rmmGraphQLRequest';
import { fetchETHGraphQLData } from '../requests/ethGraphQLRequest';

export const fetchInfoForOneWallet = async (oneAddress) => {
  try {
    console.log('Adresse reçue dans fetchInfoForOneWallet:', oneAddress);
    const xdaiData = await fetchGraphQLData(oneAddress);
    console.log(xdaiData);
    const ethData = await fetchETHGraphQLData(oneAddress);
    console.log(ethData);
    const rmmData = await fetchRMMGraphQLData(oneAddress);
    console.log(rmmData);

    let xdaiPropertyAddresses = [];
    let ethPropertyAddresses = [];
    let rmmPropertyAddresses = [];

    if (xdaiData.data && xdaiData.data.accounts && xdaiData.data.accounts[0] && xdaiData.data.accounts[0].balances) {
      xdaiPropertyAddresses = xdaiData.data.accounts[0].balances.map((balance) => balance.token.address);
    }
    if (ethData.data && ethData.data.accounts && ethData.data.accounts[0] && ethData.data.accounts[0].balances) {
      ethPropertyAddresses = ethData.data.accounts[0].balances.map((balance) => balance.token.address);
    }
    if (rmmData.data && rmmData.data.users && rmmData.data.users[0] && rmmData.data.users[0].reserves) {
      rmmPropertyAddresses = rmmData.data.users[0].reserves.map((reserve) => reserve.reserve.underlyingAsset);
    }
    const combinedPropertyAddresses = [...xdaiPropertyAddresses, ...ethPropertyAddresses, ...rmmPropertyAddresses];
    const allProperties = await fetchPropertyList(); // get all property for compare with combinedPropertyAddresses

    let filteredProperties = allProperties.filter(property =>
        combinedPropertyAddresses.includes(property.uuid.toLowerCase())
    );

    const calculatePropertyDetails = (property) => {

      let amount = null;
      const address = property.uuid.toLowerCase();

      if (rmmPropertyAddresses.includes(address)) {
          const rmmReserve = rmmData.data.users[0].reserves.find(reserve => reserve.reserve.underlyingAsset === address);
          if (rmmReserve) {
              amount = parseFloat(rmmReserve.currentATokenBalance) / Math.pow(10, 18);
          }
      } else if (xdaiPropertyAddresses.includes(address) || ethPropertyAddresses.includes(address)) {
          const balanceData = xdaiData.data.accounts[0].balances.find(balance => balance.token.address === address) ||
                              ethData.data.accounts[0].balances.find(balance => balance.token.address === address);
          if (balanceData) {
              amount = parseFloat(balanceData.amount);
          }
      }
      if (amount !== null) {
          const uuid = property.uuid || 'N/A';
          const totalValue = (parseFloat(property.tokenPrice) * amount).toFixed(2);
          return {
             uuid: uuid,
             marketplaceLink: property.marketplaceLink,
             fullName: property.fullName,
             currency: property.currency,
             tokenPrice: property.tokenPrice,
             amount: amount, // amount from blockchain
             totalValue: totalValue, // amount * tokenPrice
             type: property.propertyType,
             constructionYear: property.constructionYear,
             totalInvestment: property.totalInvestment, // total value
             squareFeet : property.squareFeet, // interior sqft
             // fee
             realtPlatform: property.realtPlatform, // realt Fee per Month
             realtPlatformPercent: property.realtPlatformPercent, // % realT fee per Month
             realtListingFee: property.realtListingFee, // RealT Listing Fee
             realtListingFeePercent:property.realtListingFeePercent,  // RealT Listing %
             // rent per token
             netRentDayPerToken: property.netRentDayPerToken,  // totalNetRentDay
             netRentMonthPerToken: property.netRentMonthPerToken,  // totalNetRentMonth
             netRentYearPerToken: property.netRentYearPerToken,  // totalNetRentYear
             // rent
             netRentDay: property.netRentDay,
             netRentMonth: property.netRentMonth,
             netRentYear: property.netRentYear,
             // unit
             totalUnits: property.totalUnits,
             rentedUnits: property.rentedUnits,
             // subsidy
             subsidyBy:property.subsidyBy,
             // composition token
             underlyingAssetPrice: property.underlyingAssetPrice,
             miscellaneousCosts: property.miscellaneousCosts,
             renovationReserve: property.renovationReserve,
             initialMaintenanceReserve: property.initialMaintenanceReserve,
             // monthly Costs
             propertyManagement: property.propertyManagement,
             propertyMaintenanceMonthly: property.propertyMaintenanceMonthly,
             propertyTaxes: property.propertyTaxes,
             insurance: property.insurance,
             utilities: property.utilities,
             // invest :
             sellPropertyTo : property.sellPropertyTo,
             // rentStartDate
             rentStartDate : property.rentStartDate
          };
        }

    };

    filteredProperties = filteredProperties
      .map(property => calculatePropertyDetails(property))
      .filter(property => property && property.uuid !== 'N/A');

    console.log(filteredProperties); // good
    return filteredProperties; // for return in promise

  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
  } // end try/catch
};

export const mergeDifferentWallet = async (walletsData) => {
  try {
    let mergedProperties = {};

    if (!Array.isArray(walletsData)) {
      console.error('walletsData n\'est pas un tableau:', walletsData);
      return;
    }
    walletsData.forEach(walletProperties => {

      if (!walletProperties) {
        console.error('walletProperties est undefined:', walletProperties);
        return;
      }

      walletProperties.forEach(property => {
        if (!property || !property.uuid) return; //  Ignorer si la propriété est mal formée

        if (mergedProperties[property.uuid]) {
          // Accumulate the amounts if the property already exists
          mergedProperties[property.uuid].amount += property.amount;
          mergedProperties[property.uuid].totalValue = (parseFloat(mergedProperties[property.uuid].tokenPrice) * mergedProperties[property.uuid].amount).toFixed(2);
        } else {
          // Add the property if it does not exist yet
          mergedProperties[property.uuid] = { ...property };
        }
      });
    });
    // Convert object to array for return
    return Object.values(mergedProperties);
  } catch (error) {
    console.error("Erreur lors de la fusion des données des wallets :", error);
    throw error;
  }
};
