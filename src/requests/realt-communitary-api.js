import axios from 'axios';

export async function fetchPropertyInfo(propertyAddress) {
  try {
    const response = await axios.get(`https://api.realt.community/v1/token/${propertyAddress}`);
    const responseData = response.data;
    console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations pour la propriété ${propertyAddress}:`, error);
    return null;
  }
}
