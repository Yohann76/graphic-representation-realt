import axios from 'axios';

/*
Example request TheGraph on subgraph

https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt/graphql?query=++++++%7B%0A++++++++users%28where%3A+%7B+id_in%3A+%5B%220x123d04f0bcd896557fd751fc2362ab8c95a0f184%22%5D+%7D%29+%7B%0A++++++++++id%0A++++++++++reserves%28%0A++++++++++++where%3A+%7B+or%3A+%5B%7B+currentATokenBalance_gt%3A+%220%22+%7D%2C+%7B+currentTotalDebt_gt%3A+%220%22+%7D%5D+%7D%0A++++++++++%29+%7B%0A++++++++++++reserve+%7B%0A++++++++++++++underlyingAsset%0A++++++++++++++name%0A++++++++++++++decimals%0A++++++++++++++usageAsCollateralEnabled%0A++++++++++++++__typename%0A++++++++++++%7D%0A++++++++++++currentATokenBalance%0A++++++++++++currentTotalDebt%0A++++++++++++__typename%0A++++++++++%7D%0A++++++++++__typename%0A++++++++%7D%0A++++++%7D
*/

export const fetchRMMGraphQLData = async (searchValue) => {
  try {
    const graphQLQueryRmm = `
      {
        users(where: { id_in: ["${searchValue}"] }) {
          id
          reserves(
            where: { or: [{ currentATokenBalance_gt: "0" }, { currentTotalDebt_gt: "0" }] }
          ) {
            reserve {
              underlyingAsset
              name
              decimals
              usageAsCollateralEnabled
              __typename
            }
            currentATokenBalance
            currentTotalDebt
            __typename
          }
          __typename
        }
      }
    `;

    const responseRMM = await axios.post(
      'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt',
      {
        query: graphQLQueryRmm,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const rmmData = responseRMM.data;
    const userData = rmmData.data.users[0];

    // Exclude reserve with name =  "Wrapped XDAI"
    const filteredReserves = userData.reserves.filter(reserve => reserve.reserve.name !== "Wrapped XDAI");

    // replace list by list filter
    userData.reserves = filteredReserves;

    return rmmData;
  } catch (error) {
    console.error('Erreur lors de la recherche sur TheGraph RMM :', error);
    throw error;
  }


};
