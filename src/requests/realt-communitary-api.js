import axios from 'axios';

// docs : https://api.realt.community/

const axiosInstance = axios.create({
  baseURL: 'https://api.realt.community/v1',
  headers: {
    "Content-Type" : "application/json",
    // "X-AUTH-REALT-TOKEN" : "1ccc0d6825c65261f4090266a36bea3b" // testing key on prod // run on prod
    "X-AUTH-REALT-TOKEN" : "41cc071a26d0055b1b086efea6d42a41" // dev // staging
  },
});

// get property info
export async function fetchPropertyInfo(propertyAddress) {
  try {
    const response = await axiosInstance.get(`/token/${propertyAddress}`);
    const responseData = response.data;
    console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations pour la propriété ${propertyAddress}:`, error);
    return null;
  }
}

// get list property
export async function fetchPropertyList() {
  try {
    const response = await axiosInstance.get(`/token`);
    const responseData = response.data;
    console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations sur la liste des propriétés :`, error);
    return null;
  }
}
