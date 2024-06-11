export interface Schedule {
    id: number;
    name: string; // 添加name字段
    start_date?: string; // ISO 8601 格式的日期字串
    end_date?: string; // ISO 8601 格式的日期字串
    description?: string;
}
