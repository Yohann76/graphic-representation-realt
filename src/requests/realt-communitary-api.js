import axios from 'axios';

export async function fetchPropertyInfo(propertyAddress) {
  try {
    // example : https://api.realt.community/v1/token/0x4637aa1a13aa4050c6e4bcd6dde9c39e80e9dd54
    const response = await axios.get(`https://api.realt.community/v1/token/${propertyAddress}`);
    const responseData = response.data;
    console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations pour la propriété ${propertyAddress}:`, error);
    return null;
  }
}
