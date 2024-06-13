import axios from 'axios';
import { Favorite } from '../models/favorite';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string,
    // start_time: string
}

type attractioEditResponse = {
    attraction: number,
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

class FavoriteService {
    async createFavorite(favorite: Favorite): Promise<Favorite> {
        const response = await axios.post(API_URL + 'favorites', favorite);
        return response.data;
    }

    // get all favorites
    async getFavorites(): Promise<Array<Favorite>> {
        const url = API_URL + `favorites`
        const response = await axios.get(url);
        return response.data;
    }

    // get favorite by id (this will get all the attractions in the favorite)
    async getFavoriteById(listId: number): Promise<Array<AttractionObject>> {
        const response = await axios.get(`${API_URL}favorites?list_id=${listId}`);
        return response.data;
    }

    async updateFavorite(listId: number, updatedFavorite: Favorite): Promise<Favorite> {
        const response = await axios.patch(API_URL + `favorites/${listId}`, updatedFavorite);
        return response.data;
    }

    async deleteFavorite(listId: number): Promise<Favorite> {
        const response = await axios.delete(API_URL + `favorites/${listId}`);
        return response.data;
    }

    async addAttractionToFavorite(listId: number, attractionId: number): Promise<AttractionObject> {
        const response = await axios.post(API_URL + `favorites/${listId}/${attractionId}`);
        return response.data;
    }

    async updateFavoriteAttraction(listId: number, attractionId: number): Promise<attractioEditResponse> {
        const response = await axios.patch(API_URL + `favorites/${listId}/${attractionId}`);
        return response.data;
    }

    async deleteFavoriteAttraction(listId: number, attractionId: number): Promise<attractioEditResponse> {
        const response = await axios.delete(API_URL + `favorites/${listId}/${attractionId}`);
        return response.data;
    }
}

export default new FavoriteService();