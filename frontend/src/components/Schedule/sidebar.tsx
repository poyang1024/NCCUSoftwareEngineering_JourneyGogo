import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
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
        padding: '20px',
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          left: '15px',
          top: '55px',
          width: '20px',
          height: '20px',
        }}
      >
        <ArrowForwardIos sx={{ width: '20px', height: '20px', color: '#AAAAAA' }} />
      </IconButton>
      <Typography
        sx={{
          position: 'absolute',
          left: '20px',
          top: '85px',
          fontSize: '24px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        行程
      </Typography>
      {/* Sidebar content */}
    </Box>
  );
};

export default Sidebar;
