// Importez Axios
import axios from 'axios';

// URL de l'API RealT
// const apiUrl = 'https://api.realt.community/'; // run basique
const apiUrl = 'https://api.realt.community/v1/token'; // List all tokens

// Fonction pour récupérer les données de l'API
const fetchRealTData = async () => {
  try {
    const response = await axios.get(apiUrl);
    // Traitez les données de réponse ici
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'API RealT :', error);
    throw error;
  }
};

export default fetchRealTData;
