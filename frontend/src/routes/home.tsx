import { useState } from 'react';
import { Box } from '@mui/material';
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/sidebar';
import FavoriteSidebar from '../components/Favorites/sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';
import AddNewFavorite from '../components/Favorites/AddNewFavorite';
import { FeaturesProvider } from '../components/Home/FeatureContext';
import { HomeContext } from '../contexts/home';

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


export default function Home() {
  // const [sidebarType, setSidebarType] = useState<'schedule' | 'favorite' | null>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoriteSidebarOpen, setFavoriteSidebarOpen] = useState(false);
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null }[]>([
    { id: 9, name: '行程1', startDate: new Date('2021-10-01'), endDate: new Date('2021-10-03') },
    { id: 6, name: '行程2', startDate: new Date('2021-10-05'), endDate: new Date('2021-10-07') },
    { id: 7, name: '行程3', startDate: new Date('2021-10-09'), endDate: new Date('2021-10-11') },
  ]);

  // using useContext hook to pass these state to children components
  // state for controlling the showing inside sidebar (scheduleList/attractions in scheduleList)
  const [selectedSchedule, setSelectedSchedule] = useState<SelectedSchedule | null>(null);
  // state for control add attraction dialog
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  // state for control attraction detail dialog
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  // state for selected attraction id
  const [selectedAttractionId, setSelectedAttractionId] = useState<number | undefined>(undefined);
  const context_values = {
    selectedSchedule,
    setSelectedSchedule,
    openAddDialog,
    setOpenAddDialog,
    openDetailDialog,
    setOpenDetailDialog,
    selectedAttractionId,
    setSelectedAttractionId
  }

  const [favorites, setFavorites] = useState<{ name: string; startDate: Date | null; endDate: Date | null; }[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // const toggleSidebar = (type: 'schedule' | 'favorite') => {
  //   setSidebarType(sidebarType === type ? null : type);
  // };

  const toggleFavoriteSidebar = () => {
    setFavoriteSidebarOpen(!favoriteSidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleFavoriteModal = () => {
    setFavoriteModalOpen(!favoriteModalOpen);
  };

  // 臨時整修(部屬用)
  const addSchedule = (id: number, name: string, startDate: Date | null, endDate: Date | null) => {
    setSchedules([...schedules, { id, name, startDate, endDate }]);
  };

  const addFavorite = (name: string) => {
    setFavorites([...favorites, { name: name, startDate: null, endDate: null }]);
  };

  return (
    <FeaturesProvider>
      <HomeContext.Provider value={context_values} >
        <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen ? '240px' : '0' }}>
          <Box flexGrow={1} sx={{ padding: '0 16px' }}>
            <TopMenuBar toggleSidebar={toggleSidebar} toggleFavoriteSidebar={toggleFavoriteSidebar} />
            <SearchBar />
            <AttractionCard />
          </Box>
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} schedules={schedules} />
          <FavoriteSidebar open={favoriteSidebarOpen} toggleFavoriteSidebar={toggleFavoriteSidebar} toggleFavoriteModal={toggleFavoriteModal} favorites={favorites} />
          <AddNewSchedule open={modalOpen} onClose={toggleModal} addSchedule={addSchedule} />
          <AddNewFavorite open={favoriteModalOpen} onClose={toggleFavoriteModal} addFavorite={addFavorite} />
        </Box>
      </HomeContext.Provider>
    </FeaturesProvider>
  );
}
