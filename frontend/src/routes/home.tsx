import { useState } from 'react';
import { Box, Container } from '@mui/material';
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/sidebar';
import FavoriteSidebar from '../components/Favorites/sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';
import AddNewFavorite from '../components/Favorites/AddNewFavorite';
import { FeaturesProvider } from '../components/Home/FeatureContext';


export default function Home() {
  // const [sidebarType, setSidebarType] = useState<'schedule' | 'favorite' | null>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoriteSidebarOpen, setFavoriteSidebarOpen] = useState(false);
  const [favoriteModalOpen, setFavoriteModalOpen]  = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<{ name: string, startDate: Date | null, endDate: Date | null }[]>([]);
  const [favorites, setFavorites] = useState<{ name: string }[]>([]);

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

  const addSchedule = (name: string, startDate: Date | null, endDate: Date | null) => {
    setSchedules([...schedules, { name, startDate, endDate }]);
  };

  const addFavorite = (name: string) => {
    setFavorites([...favorites, { name }]);
  };

  return (
    <FeaturesProvider>
      <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen || favoriteSidebarOpen ? '240px' : '0' }}>
        <Box flexGrow={1} sx={{ padding: '0 16px' }}>
          <TopMenuBar 
            toggleSidebar={() => toggleSidebar()}
            toggleFavoriteSidebar={() => toggleFavoriteSidebar()}
          />
          {/* <TopMenuBar 
            toggleSidebar={() => toggleSidebar('schedule')}
            toggleFavoriteSidebar={() => toggleSidebar('favorite')}
          /> */}
          <SearchBar />
          <AttractionCard />
        </Box>
        {/* {sidebarType === 'schedule' && (
          <Sidebar open={!!sidebarType} toggleSidebar={() => toggleSidebar('schedule')} toggleModal={toggleModal} schedules={schedules} />
        )}
        {sidebarType === 'favorite' && (
          <FavoriteSidebar open={!!sidebarType} toggleFavoriteSidebar={() => toggleSidebar('favorite')} toggleFavoriteModal={toggleFavoriteModal} favorites={favorites} />
        )} */}
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} schedules={schedules} />
        <FavoriteSidebar open={favoriteSidebarOpen} toggleFavoriteSidebar={toggleFavoriteSidebar} toggleFavoriteModal={toggleFavoriteModal} favorites={favorites} />
        <AddNewSchedule open={modalOpen} onClose={toggleModal} addSchedule={addSchedule} />
        <AddNewFavorite open={favoriteModalOpen} onClose={toggleFavoriteModal} addFavorite={addFavorite} />
      </Box>
    </FeaturesProvider>
  );
}
