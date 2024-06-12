import React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

const FavoriteSidebar: React.FC<{ open: boolean; toggleFavoriteSidebar: () => void; toggleFavoriteModal: () => void; favorites: { name: string, startDate: Date | null, endDate: Date | null }[] }> = ({ open, toggleFavoriteSidebar, toggleFavoriteModal, favorites }) => {
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
      <IconButton
        onClick={toggleFavoriteSidebar}
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
          margin: '85px 20px 20px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        收藏
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '0 20px',
          marginBottom: '20px',
        }}
      >
        {favorites.map((favorite, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: 'rgba(184, 207, 196, 0.15)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
              {favorite.name}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '14px', color: '#808080' }}>
              {favorite.startDate?.toLocaleDateString()} - {favorite.endDate?.toLocaleDateString()}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          height: '60px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: '145px',
          paddingRight: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: '140px',
            height: '40px',
            fontSize: '16px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '20px',
            marginTop: '10px',
            marginBottom: '10px',
          }}
          onClick={toggleFavoriteModal}
        >
          + 新增收藏表
        </Button>
      </Box>
    </Box>
  );
};

export default FavoriteSidebar;
