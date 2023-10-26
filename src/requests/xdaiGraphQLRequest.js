// base_request.js
// src/requests/graphQLRequest.js
import axios from 'axios';

export const fetchGraphQLData = async (searchValue) => {
  try {
    const graphQLQuery = `
      {
        accounts(where: {address: "${searchValue}"}) {
          balances(
            where: {amount_gt: "0"}
            first: 100
            orderBy: amount
            orderDirection: desc
            skip: 0
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
      'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-xdai',
      {
        query: graphQLQuery,
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
    console.error('Erreur lors de la recherche sur TheGraph :', error);
    throw error;
  }
};
