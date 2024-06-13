import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import TopMenuBar from '../components/TopMenuBar'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function Root() {
  const [sideBarType, setSideBarType] = useState <0 | 1 | 2>(0);

  const toggleSidebar = (type: 0 | 1 | 2) => {
    setSideBarType(type);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <TopMenuBar toggleSidebar={toggleSidebar} sideBarType={sideBarType} />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          paddingBottom: 5,
        }}
      >
        <Toolbar></Toolbar>
        <Outlet />
        <Footer/>
      </Box>
    </Box>
  )
}
