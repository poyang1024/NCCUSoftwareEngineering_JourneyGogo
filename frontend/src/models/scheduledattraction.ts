import { Schedule } from '../models/schedule';

export interface ScheduledAttraction extends Schedule {
    start_time?: string; // ISO 8601 格式的日期和時間字串
    end_time?: string; // ISO 8601 格式的日期和時間字串
    saved_list: number;
    attraction: number;
    type: number;
}