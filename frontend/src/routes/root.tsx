import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import TopMenuBar from '../components/TopMenuBar'
import Footer from '../components/Footer'

export default function Root() {

  return (
    <Box sx={{ display: 'flex' }}>
      <TopMenuBar toggleSidebar={function (): void {
        throw new Error('Function not implemented.')
      }} toggleFavoriteSidebar={function (): void {
        throw new Error('Function not implemented.')
      }} />
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
