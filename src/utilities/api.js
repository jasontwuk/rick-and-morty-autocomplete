import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/character`, {
            params: { name: query },
        });
        console.log(response.data);
        
        return response.data.results || [];
    } catch (error) {
        if (!error.response) {
            // *** Note: API is unavailable (network or server issue)
            throw new Error('The API is currently unavailable. Please try again later.');
        } else if (error.response.status === 404) {
            // *** Note: no characters found
            return [];
        } else {
            throw new Error('An error occurred while fetching data.');
        }
    }
};
