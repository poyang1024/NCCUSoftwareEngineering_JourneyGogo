import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';
import Sidebar from '../components/Schedule/sidebar';
import TopMenuBar from '../components/TopMenuBar';
import AddNewSchedule from '../components/Schedule/AddNewSchedule';
import { FeaturesProvider } from '../components/Home/FeatureContext';
import ScheduleService from '../services/schedule.service';
import { Schedule } from '../models/schedule';

type ScheduleObject = {
  id: number, name: string, startDate: Date | null, endDate: Date | null
}

type AttractionObject = {
  attraction_id: number,
  attraction_name: string,
  image: string,
  start_time: string
}

type SelectedSchedule = {
  schedule: ScheduleObject,
  attractions: AttractionObject[]
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleObject[]>([]);
  const [initialSchedule, setInitialSchedule] = useState<ScheduleObject | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // state for controlling the showing inside sidebar (scheduleList/attractions in scheduleList)
  const [selectedSchedule, setSelectedSchedule] = useState<SelectedSchedule | null>(null);
  const context_values = {
    selectedSchedule,
    setSelectedSchedule
  }


  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await ScheduleService.getSchedules();
        const formattedSchedules = response.filter((item): item is Schedule => 'name' in item).map((schedule) => ({
          id: schedule.id,
          name: schedule.name,
          startDate: schedule.start_date ? new Date(schedule.start_date) : null,
          endDate: schedule.end_date ? new Date(schedule.end_date) : null,
        }));
        setSchedules(formattedSchedules);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };

    fetchSchedules();
  }, []);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModal = (initialSchedule: ScheduleObject | null = null, mode: 'add' | 'edit' = 'add') => {
    setModalOpen((prev) => !prev);
    if (!modalOpen) { // 打開時設置初始值
      setInitialSchedule(initialSchedule);
      setModalMode(mode);
    }
  };

  const addSchedule = (newSchedules: ScheduleObject[]) => {
    setSchedules(newSchedules);
  };

  const removeSchedule = (id: number) => { // 進不到這
    console.log('Removing schedule with id:', id);
    setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
};

  return (
    <FeaturesProvider>
      <Box display="flex" sx={{ transition: 'margin 0.3s', marginRight: sidebarOpen ? '240px' : '0' }}>
        <Box flexGrow={1}>
          <TopMenuBar toggleSidebar={toggleSidebar} />
          <SearchBar />
          <AttractionCard />
        </Box>
        <Sidebar 
          open={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          toggleModal={toggleModal} 
          schedules={schedules} 
          setSchedules={setSchedules}
          removeSchedule={removeSchedule} 
        />
        <AddNewSchedule 
          open={modalOpen} 
          onClose={() => toggleModal(null, 'add')} 
          schedules={schedules} 
          addSchedule={addSchedule} 
          mode={modalMode} 
          initialSchedule={initialSchedule} 
        />
      </Box>
    </FeaturesProvider>
  );
}
