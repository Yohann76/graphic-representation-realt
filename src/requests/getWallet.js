import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';

const XDAIClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-xdai',
  cache: new InMemoryCache(),
});

const RMMClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt',
  cache: new InMemoryCache(),
});

const RealTokenQuery = gql`
{
  accounts(where: {address: $searchValue}) {
    balances(
      where: {amount_gt: "0"}
      first: 500
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

const RMMQuery = gql`
  query RMMQuery($searchValue: [String]!) {
    users(where: {id_in: $searchValue}) {
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


// Fonction pour obtenir les données de portefeuille
async function getWalletsResult(searchValue) {
  // Effectuez les requêtes Apollo Client pour XDai et RMM
  const [xdaiResult, rmmResult] = await Promise.all([
    XDAIClient.query({
      query: RealTokenQuery,
      variables: { searchValue },
    }),
    RMMClient.query({
      query: RMMQuery,
      variables: { searchValue },
    }),
  ]);

  // Traitement des données et extraction des informations nécessaires
  // ...

  return {
    // Organisez les données ici selon vos besoins
  };
}

export { XDAIClient, RMMClient, RealTokenQuery, RMMQuery, getWalletsResult };
