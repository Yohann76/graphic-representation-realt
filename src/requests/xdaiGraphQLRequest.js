// src/requests/graphQLRequest.js
import axios from 'axios';

/*
Example request TheGraph on subgraph

https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-xdai/graphql?query=%7B%0A++accounts%28where%3A+%7Baddress%3A+%0A%220x123d04f0bcd896557fd751fc2362ab8c95a0f184%22%7D%29+%7B%0A++++balances%28%0A++++++where%3A+%7Bamount_gt%3A+%0A%220%22%7D%0A++++++first%3A+100%0A++++++orderBy%3A+amount%0A++++++orderDirection%3A+desc%0A++++++skip%3A+0%0A++++%29+%7B%0A++++++token+%7B%0A++++++++address%0A++++++++__typename%0A++++++%7D%0A++++++amount%0A++++++__typename%0A++++%7D%0A++++__typename%0A++%7D%0A%7D
*/

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
