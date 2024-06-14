import React, { useContext } from 'react';
import { Box } from '@mui/material';
import ScheduleList from './ScheduleList';
import FavoriteList from '../Favorites/FavoriteList';
import AttracionList from './AttracionList';
import FavoriteAttracionList from '../Favorites/FavoriteAttracionList';
import scheduleService from '../../services/schedule.service';
import favoriteService from '../../services/favorite.service';
import { HomeContext } from '../../contexts/home';

type ScheduleObject = {
  id: number, name: string, startDate: Date | null, endDate: Date | null
}
type FavoriteObject = {
  id: number, name: string
}

const Sidebar: React.FC<{ open: boolean; sideBarType: 0 | 1 | 2; toggleSidebar: (type: 0 | 1 | 2) => void; toggleModal: () => void; toggleModalFavorite: () => void; schedules: ScheduleObject[]; favorites: FavoriteObject[]; removeSchedule: (id: number) => void; removeFavorite: (id: number) => void; }> = ({ open, sideBarType, toggleSidebar, toggleModal, toggleModalFavorite, schedules, favorites, removeSchedule, removeFavorite }) => {
  const scheduleContext = useContext(HomeContext);
  if (!scheduleContext) {
    throw new Error('Component must be used within a MyProvider');
  }
  const { selectedSchedule, setSelectedSchedule, selectedFavorite, setSelectedFavorite } = scheduleContext;

  const scheduleSelectHandler = async (schedule: ScheduleObject) => {
    // fetch attraction data by aid API
    const attraction = await scheduleService.getScheduleById(schedule.id);
    setSelectedSchedule({
      schedule: schedule,
      attractions: attraction
    });
  }
  const favoriteSelectHandler = async (favorite: FavoriteObject) => {
    // fetch attraction data by aid API
    const attraction = await favoriteService.getFavoriteById(favorite.id);
    setSelectedFavorite({
      favorite: favorite,
      attractions: attraction
    });
  }

  const gobackHandler = () => {
    setSelectedSchedule(null);
  }

  const favGobackHandler = () => {
    setSelectedFavorite(null);
  }

  return (
    <Box
      sx={{
        width: '305px',
        height: '100vh',
        position: 'fixed',
        right: open ? 0 : '-305px',
        top: 0,
        transition: 'right 0.3s',
        bgcolor: 'background.paper',
        boxShadow: 3,
        zIndex: 1201,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      { sideBarType === 1 ? (
        selectedSchedule == null ? (
          <ScheduleList schedules={schedules} toggleModal={toggleModal} toggleSidebar={() => toggleSidebar(0)} scheduleSelectHandler={scheduleSelectHandler} removeSchedule={removeSchedule} />
        ) : (
          <AttracionList toggleSidebar={() => toggleSidebar(0)} gobackHandler={gobackHandler} />
        )
      ) : sideBarType === 2 ? (
        selectedFavorite == null ? (
          <FavoriteList favorites={favorites} toggleModalFavorite={toggleModalFavorite} toggleSidebar={() => toggleSidebar(0)} favoriteSelectHandler={favoriteSelectHandler} removeFavorite={removeFavorite}/>
        ) : (
          <FavoriteAttracionList toggleSidebar={() => toggleSidebar(0)} gobackHandler={favGobackHandler} />
        )
      ) : null}    </Box>
  );
};

export default Sidebar;
