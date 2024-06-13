import React, { useContext } from 'react';
import { Box } from '@mui/material';
import ScheduleList from './ScheduleList';
import AttracionList from './AttracionList';
import scheduleService from '../../services/schedule.service';
import { HomeContext } from '../../contexts/home';

type ScheduleObject = {
  id: number, name: string, startDate: Date | null, endDate: Date | null
}

const Sidebar: React.FC<{ open: boolean; toggleSidebar: () => void; toggleModal: () => void; schedules: ScheduleObject[]; removeSchedule: (id: number) => void; }> = ({ open, toggleSidebar, toggleModal, schedules, removeSchedule }) => {
  const scheduleContext = useContext(HomeContext);
  if (!scheduleContext) {
    throw new Error('Component must be used within a MyProvider');
  }
  const { selectedSchedule, setSelectedSchedule } = scheduleContext;

  const scheduleSelectHandler = async (schedule: ScheduleObject) => {
    // fetch attraction data by aid API
    const attraction = await scheduleService.getScheduleById(schedule.id);
    setSelectedSchedule({
      schedule: schedule,
      attractions: attraction
    });
  }

  const gobackHandler = () => {
    setSelectedSchedule(null);
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
      {selectedSchedule == null ? <ScheduleList schedules={schedules} toggleModal={toggleModal} toggleSidebar={toggleSidebar} scheduleSelectHandler={scheduleSelectHandler} removeSchedule={removeSchedule} /> : <AttracionList toggleSidebar={toggleSidebar} gobackHandler={gobackHandler} />}
    </Box>
  );
};

export default Sidebar;
