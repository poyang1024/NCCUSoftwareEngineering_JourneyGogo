import { useState } from 'react';
import { Box } from '@mui/material';
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';
import { FeaturesProvider } from '../components/Home/FeatureContext';


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<{ name: string, startDate: Date | null, endDate: Date | null }[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const addSchedule = (name: string, startDate: Date | null, endDate: Date | null) => {
    setSchedules([...schedules, { name, startDate, endDate }]);
  };

  return (
    <FeaturesProvider>
      <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen ? '240px' : '0' }}>
        <Box flexGrow={1} sx={{ padding: '0 16px' }}>
          <TopMenuBar toggleSidebar={toggleSidebar} />
          <SearchBar />
          <AttractionCard />
        </Box>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} schedules={schedules} />
        <AddNewSchedule open={modalOpen} onClose={toggleModal} addSchedule={addSchedule} />
      </Box>
    </FeaturesProvider>
  );
}
