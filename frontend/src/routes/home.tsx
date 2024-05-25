import React, { useState } from 'react';
// import { GitHub } from '@mui/icons-material'
import {
  Box,
  Container,
} from '@mui/material'
// import { useLoaderData } from 'react-router-dom'
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/Sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen ? '240px' : '0' }}>
      <Box flexGrow={1}>
        <TopMenuBar toggleSidebar={toggleSidebar} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <SearchBar />
          <AttractionCard />
        </Container>
      </Box>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} />
      <AddNewSchedule open={modalOpen} onClose={toggleModal} />
    </Box>
  );
}