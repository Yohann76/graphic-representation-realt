// src/requests/graphQLRequest.js
import axios from 'axios';

export const fetchETHGraphQLData = async (searchValue, skip = 0, limit = 500) => {
  try {
    const graphQLQueryEth = `
      {
        accounts(where: {address_in: ["0xa83fd493cbec73c29430f54e994514b2b23ce099"] }) {
          balances(
            where: {amount_gt: "0"}
            first: ${limit}
            orderBy: amount
            orderDirection: desc
            skip: ${skip}
          ) {
            token {
              address
              __typename
            }
            amount
            __typename
          }
          __typename
        }
      }
    `;

    const response = await axios.post(
      'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-eth',
      {
        query: graphQLQueryEth,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const searchData = response.data;
    return searchData;
  } catch (error) {
    console.error('Erreur lors de la recherche sur TheGraph ETH :', error);
    throw error;
  }
};
