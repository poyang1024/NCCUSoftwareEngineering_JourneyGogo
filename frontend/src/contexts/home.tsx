import { createContext, Dispatch, SetStateAction } from "react";

type ScheduleObject = {
    id: number, name: string, startDate: Date | null, endDate: Date | null
}

type FavoriteObject = {
    id: number, name: string
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

type SelectedFavorite = {
    favorite: FavoriteObject,
    attractions: AttractionObject[]
}

type myContext = {
    selectedSchedule: SelectedSchedule | null,
    setSelectedSchedule: Dispatch<SetStateAction<SelectedSchedule | null>>
    selectedFavorite: SelectedFavorite | null,
    setSelectedFavorite: Dispatch<SetStateAction<SelectedFavorite | null>>,
    openAddDialog: boolean,
    setOpenAddDialog: Dispatch<SetStateAction<boolean>>,
    openFavDialog: boolean,
    setOpenFavDialog: Dispatch<SetStateAction<boolean>>
    openDetailDialog: boolean,
    setOpenDetailDialog: Dispatch<SetStateAction<boolean>>
    selectedAttractionId: number | undefined,
    setSelectedAttractionId: Dispatch<SetStateAction<number | undefined>>
    schedules: ScheduleObject[],
    setSchedules: Dispatch<SetStateAction<ScheduleObject[]>>,
    favorites: FavoriteObject[],
    setFavorites: Dispatch<SetStateAction<FavoriteObject[]>>,
}

const HomeContext = createContext<myContext | null>(null);
export { HomeContext };