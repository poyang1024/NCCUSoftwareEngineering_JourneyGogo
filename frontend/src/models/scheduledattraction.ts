export interface ScheduledAttraction {
    id: number;
    attraction_id: number;
    attraction_name: string;
    image: string;
    start_time: string; // ISO 8601 格式的日期和時間字串
}