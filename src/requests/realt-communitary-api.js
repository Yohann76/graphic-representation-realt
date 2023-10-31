import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.realt.community/v1', // ou l'URL de votre API
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchPropertyInfo(propertyAddress) {
  try {
    // Utilisez votre instance Axios personnalisée
    const response = await axiosInstance.get(`/token/${propertyAddress}`);
    const responseData = response.data;
    console.log('Réponse de l\'API :', responseData);
    return responseData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations pour la propriété ${propertyAddress}:`, error);
    return null;
  }
}
