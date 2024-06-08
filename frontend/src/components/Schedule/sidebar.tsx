import React from 'react';
import { Box } from '@mui/material';
import ScheduleList from './ScheduleList';


const Sidebar: React.FC<{ open: boolean; toggleSidebar: () => void; toggleModal: () => void; schedules: { name: string, startDate: Date | null, endDate: Date | null }[] }> = ({ open, toggleSidebar, toggleModal, schedules }) => {
  // make a fake data to test the sidebar
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
      <ScheduleList schedules={schedules} toggleModal={toggleModal} toggleSidebar={toggleSidebar} />
    </Box>
  );
};

export default Sidebar;
