import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';
import AddNewFavorite from '../components/Favorites/AddNewFavorite';
import { FeaturesProvider } from '../components/Home/FeatureContext';
import ScheduleService from '../services/schedule.service';
import { Schedule } from '../models/schedule';
import { HomeContext } from '../contexts/home';

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


export default function Home() {
  // const [sidebarType, setSidebarType] = useState<'schedule' | 'favorite' | null>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoriteSidebarOpen, setFavoriteSidebarOpen] = useState(false);
  const [sideBarType, setSideBarType] = useState<0 | 1 | 2>(0);
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialSchedule, setInitialSchedule] = useState<ScheduleObject | null>(null);
  const [initialFavorite, setInitialFavorite] = useState<FavoriteObject | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalModeFavorite, setmodalModeFavorite] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await ScheduleService.getSchedules();
        const formattedSchedules = response.filter((item): item is Schedule => 'name' in item).map((schedule) => ({
          id: schedule.id,
          name: schedule.name,
          startDate: schedule.start_date ? new Date(schedule.start_date) : null,
          endDate: schedule.end_date ? new Date(schedule.end_date) : null,
        }));
        setSchedules(formattedSchedules);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  // using useContext hook to pass these state to children components
  // state for controlling the showing inside sidebar (scheduleList/attractions in scheduleList)
  const [selectedSchedule, setSelectedSchedule] = useState<SelectedSchedule | null>(null);
  const [selectedFavorite, setSelectedFavorite] = useState<SelectedFavorite | null>(null);
  // state for control add attraction dialog
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  // state for control attraction detail dialog
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  // state for selected attraction id
  const [selectedAttractionId, setSelectedAttractionId] = useState<number | undefined>(undefined);
  // schedules state
  const [schedules, setSchedules] = useState<ScheduleObject[]>([]);
  const [favorites, setFavorites] = useState<FavoriteObject[]>([]);

  const context_values = {
    selectedSchedule,
    setSelectedSchedule,
    selectedFavorite,
    setSelectedFavorite,
    openAddDialog,
    setOpenAddDialog,
    openDetailDialog,
    setOpenDetailDialog,
    selectedAttractionId,
    setSelectedAttractionId,
    schedules,
    setSchedules,
    favorites,
    setFavorites
  }

  const toggleSidebar = (type: 0 | 1 | 2) => {
    setSidebarOpen(!sidebarOpen);
    setSideBarType(type);
  };

  const toggleModal = (initialSchedule: ScheduleObject | null = null, mode: 'add' | 'edit' = 'add') => {
    setModalOpen((prev) => !prev);
    if (!modalOpen) { // 打開時設置初始值
      setInitialSchedule(initialSchedule);
      setModalMode(mode);
    }
  };

  const toggleModalFavorite = (initialFavorite: FavoriteObject | null = null, mode: 'add' | 'edit' = 'add') => {
    setFavoriteModalOpen((prev) => !prev)
    if (!modalOpen) { // 打開時設置初始值
      setInitialFavorite(initialFavorite);
      setmodalModeFavorite(mode);
    }
  };

  // const addSchedule = (newSchedules: ScheduleObject[]) => {
  //   setSchedules(newSchedules);
  // }
  // const toggleSidebar = (type: 'schedule' | 'favorite') => {
  //   setSidebarType(sidebarType === type ? null : type);
  // };

  const removeSchedule = (id: number) => { // 進不到這
    setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
  };
  const removeFavorite = (id: number) => { // 進不到這
    setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite.id !== id));
  };

  return (
    <FeaturesProvider>
      <HomeContext.Provider value={context_values} >
        <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen ? '240px' : '0' }}>
          <Box flexGrow={1} sx={{ padding: '0 16px' }}>
            <TopMenuBar toggleSidebar={toggleSidebar} sideBarType={sideBarType}/>
            <SearchBar />
            <AttractionCard />
          </Box>
          <Sidebar
            open={sidebarOpen}
            sideBarType={sideBarType}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            toggleModalFavorite={toggleModalFavorite}
            schedules={schedules}
            favorites={favorites}
            removeSchedule={removeSchedule}
            removeFavorite={removeFavorite}
          />
          {/* <FavoriteSidebar open={favoriteSidebarOpen} toggleFavoriteSidebar={toggleFavoriteSidebar} toggleFavoriteModal={toggleFavoriteModal} favorites={favorites} /> */}
          <AddNewSchedule
            open={modalOpen}
            onClose={() => toggleModal(null, 'add')}
            mode={modalMode}
            initialSchedule={initialSchedule}
          />
          <AddNewFavorite 
            open={favoriteModalOpen} 
            onClose={() => toggleModalFavorite(null, 'add')}
            mode = {modalModeFavorite}
            initialFavorite={initialFavorite}
          />
        </Box>
      </HomeContext.Provider>
    </FeaturesProvider>
  );
}