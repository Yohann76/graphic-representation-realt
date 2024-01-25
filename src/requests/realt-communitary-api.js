import axios from 'axios';

// docs : https://api.realt.community/

const axiosInstance = axios.create({
  baseURL: 'https://api.realt.community/v1',
  // baseURL: 'https://api.preprod.realt.community/v1', // localhost
  headers: {
    "Content-Type" : "application/json",
    "X-AUTH-REALT-TOKEN" : "a515f19d41c6a766d9757c5a6807afc13fca309c2ffe49bf4f959c50bad08d7b" // https://myrealtstat.netlify.app
    // "X-AUTH-REALT-TOKEN" : "d96a32592f1774f69c184efefe5afa1759f2ad1a81e827ac64b4a1d730aeaf7a" // dev api.preprod // staging localhost
  },
});

// get property info
export async function fetchPropertyInfo(propertyAddress) {
  try {
    const response = await axiosInstance.get(`/token/${propertyAddress}`);
    const responseData = response.data;
    // console.log('Réponse de l\'API :', responseData);
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
    // console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations sur la liste des propriétés :`, error);
    return null;
  }
}
