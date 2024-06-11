/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { Attraction } from '../models/attraction'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class AttractionService {
  async getAttraction(city?: string, keyword?: string): Promise<Array<Attraction>> {
    const url = API_URL + 'attractions/';
    const params = new URLSearchParams();

    if (city) {
      params.append('city', city);
    }
    if (keyword) {
      params.append('keyword', keyword);
    }

    const response = await axios.get(url, { params });
    const attractions = response.data.map((item: any) => ({
      ...item.attraction,
      favorite: item.favorite,
      comments: item.comments.map((comment: any) => comment.content)
    }));

    return attractions;
  }

  async getAttractionById(id: number): Promise<{ attraction: Attraction; favorite: number; comments: Array<string> }> {
    const response = await axios.get(`${API_URL}attractions/${id}`);
    const { attraction, favorite, comments } = response.data;
    return {
      attraction: { ...attraction, comments: comments.map((comment: any) => comment.content) },
      favorite,
      comments: comments.map((comment: any) => comment.content),
    };
  }
}

export default new AttractionService()
