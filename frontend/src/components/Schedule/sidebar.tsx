import React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';


const Sidebar: React.FC<{ open: boolean; toggleSidebar: () => void; toggleModal: () => void; }> = ({ open, toggleSidebar, toggleModal }) => {
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
          margin: '85px 20px 20px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        行程
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '0 20px',
          marginBottom: '20px',
        }}
      >
        {/* 測試用行程表卡片 */}
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        <Box
          sx={{
            bgcolor: '#E0E0E0',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          行程表卡片
        </Box>
        {/* 可以添加更多行程表卡片 */}
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
          onClick={toggleModal}
        >
          + 新增行程表
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;