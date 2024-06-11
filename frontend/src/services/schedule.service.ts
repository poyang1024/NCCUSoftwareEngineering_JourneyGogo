import axios from 'axios';
import { Schedule } from '../models/schedule';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string,
    start_time: string
}

type attractioEditResponse = {
    attraction: number,
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

class ScheduleService {
    async createSchedule(schedule: Schedule): Promise<Schedule> {
        const response = await axios.post(API_URL + 'schedules', schedule);
        return response.data;
    }

    // get all schedules
    async getSchedules(): Promise<Array<Schedule>> {
        const url = API_URL + `schedules`
        const response = await axios.get(url);
        return response.data;
    }

    // get schedule by id (this will get all the attractions in the schedule)
    async getScheduleById(listId: number): Promise<Array<AttractionObject>> {
        const response = await axios.get(`${API_URL}schedules?list_id=${listId}`);
        return response.data;
    }

    async updateSchedule(listId: number, updatedSchedule: Schedule): Promise<Schedule> {
        const response = await axios.patch(API_URL + `schedules/${listId}`, updatedSchedule);
        return response.data;
    }

    async deleteSchedule(listId: number): Promise<Schedule> {
        const response = await axios.delete(API_URL + `schedules/${listId}`);
        return response.data;
    }

    async addAttractionToSchedule(listId: number, attractionId: number, timeInterval: { start_time: string }): Promise<AttractionObject> {
        const response = await axios.post(API_URL + `schedules/${listId}/${attractionId}`, timeInterval);
        return response.data;
    }

    async updateScheduleAttraction(listId: number, attractionId: number, update: { start_time: string }): Promise<attractioEditResponse> {
        const response = await axios.patch(API_URL + `schedules/${listId}/${attractionId}`, update);
        return response.data;
    }

    async deleteScheduleAttraction(listId: number, attractionId: number): Promise<attractioEditResponse> {
        const response = await axios.delete(API_URL + `schedules/${listId}/${attractionId}`);
        return response.data;
    }
}

export default new ScheduleService();