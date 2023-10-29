import axios from 'axios';

export const fetchRMMGraphQLData = async (addressList, skip = 0, limit = 500) => {
  try {
    const graphQLQuery = `
      query RMMQuery($addressList: [String]!) {
        users(where: {id_in: $addressList}) {
          id
          reserves(
            where: {or: [{currentATokenBalance_gt: "0"}, {currentTotalDebt_gt: "0"}]}
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

    const response = await axios.post(
      'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt',
      {
        query: graphQLQuery,
        variables: {
          addressList,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const rmmData = response.data;
    return rmmData;
  } catch (error) {
    console.error('Erreur lors de la recherche sur RMM :', error);
    throw error;
  }
};
