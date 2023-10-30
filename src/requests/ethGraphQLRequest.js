// src/requests/ethGraphQLRequest.js
import axios from 'axios';

/*
Example request TheGraph on subgraph

https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-eth/graphql?query=%7B%0A++accounts%28where%3A+%7Baddress_in%3A+%5B%220xa83fd493cbec73c29430f54e994514b2b23ce099%22%5D%7D%29+%7B%0A++++address%0A++++balances%28%0A++++++where%3A+%7Bamount_gt%3A+%220%22%7D%0A++++++first%3A+1000%0A++++++orderBy%3A+amount%0A++++++orderDirection%3A+desc%0A++++%29+%7B%0A++++++token+%7B%0A++++++++address%0A++++++++__typename%0A++++++%7D%0A++++++amount%0A++++++__typename%0A++++%7D%0A++++__typename%0A++%7D%0A%7D
*/

export const fetchETHGraphQLData = async (searchValue, skip = 0, limit = 500) => {

  const searchValueLowerCase = searchValue.toLowerCase();

  try {
    const graphQLQueryEth = `
      {
        accounts(where: {address_in: ["${searchValueLowerCase}"] }) {
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

    const ethData = response.data;
    return ethData;
  } catch (error) {
    console.error('Erreur lors de la recherche sur TheGraph ETH :', error);
    throw error;
  }
};
