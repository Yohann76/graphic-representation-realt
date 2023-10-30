import axios from 'axios';

export const fetchRMMGraphQLData = async (searchValue) => {
  try {
    const graphQLQueryRmm = `
      {
        users(where: { id_in: ["0x123d04f0bcd896557fd751fc2362ab8c95a0f184"] }) {
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
    console.error('Erreur lors de la recherche sur RMM :', error);
    throw error;
  }


};
