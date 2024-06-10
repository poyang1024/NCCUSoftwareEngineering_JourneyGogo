import { createContext, Dispatch, SetStateAction } from "react";

type ScheduleObject = {
    id: number, name: string, startDate: Date | null, endDate: Date | null
}

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string,
    start_time: string
}

type SelectedSchedule = {
    schedule: ScheduleObject,
    attractions: AttractionObject[]
}

type myContext = {
    selectedSchedule: SelectedSchedule | null,
    setSelectedSchedule: Dispatch<SetStateAction<SelectedSchedule | null>>
}

const selectedScheduleContext = createContext<myContext | null>(null);
export { selectedScheduleContext };