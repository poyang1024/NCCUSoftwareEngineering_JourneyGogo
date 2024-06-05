import axios from 'axios';
import { Schedule } from '../models/schedule';
import { ScheduledAttraction } from '../models/scheduledattraction';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

class ScheduleService {
    async createSchedule(schedule: Schedule): Promise<void> {
        const response = await axios.post(API_URL + 'schedules', schedule);
        return response.data;
    }

    async getSchedules(listId?: number): Promise<Array<Schedule | ScheduledAttraction>> {
        const url = listId ? API_URL + `schedules?list_id=${listId}` : API_URL + 'schedules';
        const response = await axios.get(url);
        return response.data;
    }

    async updateSchedule(listId: number, schedule: Partial<Schedule>): Promise<Schedule> {
        const response = await axios.patch(API_URL + `schedules/${listId}`, schedule);
        return response.data;
    }

    async deleteSchedule(listId: number): Promise<Schedule> {
        const response = await axios.delete(API_URL + `schedules/${listId}`);
        return response.data;
    }

    async addAttractionToSchedule(listId: number, attractionId: number, timeInterval: { start_time: string, end_time: string }): Promise<void> {
        const response = await axios.post(API_URL + `schedules/${listId}/${attractionId}`, timeInterval);
        return response.data;
    }

    async updateScheduleAttraction(listId: number, attractionId: number, update: { start_time: string }): Promise<void> {
        const response = await axios.patch(API_URL + `schedules/${listId}/${attractionId}`, update);
        return response.data;
    }

    async deleteScheduleAttraction(listId: number, attractionId: number): Promise<void> {
        const response = await axios.delete(API_URL + `schedules/${listId}/${attractionId}`);
        return response.data;
    }
}

export default new ScheduleService();