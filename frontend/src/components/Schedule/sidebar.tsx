import React, { useState } from 'react';
import { Box } from '@mui/material';
import ScheduleList from './ScheduleList';
import AttracionList from './AttracionList';

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

const Sidebar: React.FC<{ open: boolean; toggleSidebar: () => void; toggleModal: () => void; schedules: ScheduleObject[] }> = ({ open, toggleSidebar, toggleModal, schedules }) => {
  // state for controlling the showing inside sidebar (scheduleList/attractions in scheduleList)
  const [selectedSchedule, setSelectedSchedule] = useState<SelectedSchedule | null>(null);

  const scheduleSelectHandler = (schedule: ScheduleObject) => {
    // TODO: fetch attraction data by aid API
    const attractions = [
      {
        "attraction_id": 125,
        "attraction_name": "Grand Hyatt Taipei",
        "image": "https://lh5.googleusercontent.com/p/AF1QipMKZscSTH19FxIfzvVziLIEc3LHzSfedqwot_rf=w408-h271-k-no",
        "start_time": "2024-06-07T16:05:00"
      },
      {
        "attraction_id": 126,
        "attraction_name": "捷絲旅臺大尊賢館 - Just Sleep Taipei NTU",
        "image": "https://lh5.googleusercontent.com/p/AF1QipPr5o1jJ30u-vzQW8Y2ndp8vl6AzjESqL7fJmEH=w408-h611-k-no",
        "start_time": "2024-06-07T16:00:00"
      },
      {
        "attraction_id": 126,
        "attraction_name": "捷絲旅臺大尊賢館 - Just Sleep Taipei NTU",
        "image": "https://lh5.googleusercontent.com/p/AF1QipPr5o1jJ30u-vzQW8Y2ndp8vl6AzjESqL7fJmEH=w408-h611-k-no",
        "start_time": "2024-06-07T16:00:00"
      },
      {
        "attraction_id": 126,
        "attraction_name": "捷絲旅臺大尊賢館 - Just Sleep Taipei NTU",
        "image": "https://lh5ogleusercontent.com/p/AF1QipPr5o1jJ30u-vzQW8Y2ndp8vl6AzjESqL7fJmEH=w408-h611-k-no",
        "start_time": "2024-06-07T16:00:00"
      },
      {
        "attraction_id": 126,
        "attraction_name": "捷絲旅臺大尊賢館 - Just Sleep Taipei NTU",
        "image": "https://lh5.googleusercontent.com/p/AF1QipPr5o1jJ30u-vzQW8Y2ndp8vl6AzjESqL7fJmEH=w408-h611-k-no",
        "start_time": "2024-06-07T16:00:00"
      },
      {
        "attraction_id": 126,
        "attraction_name": "捷絲旅臺大尊賢館 - Just Sleep Taipei NTU",
        "image": "https://lh5.googleusercontent.com/p/AF1QipPr5o1jJ30u-vzQW8Y2ndp8vl6AzjESqL7fJmEH=w408-h611-k-no",
        "start_time": "2024-06-07T16:00:00"
      },
      {
        "attraction_id": 127,
        "attraction_name": "柯達大飯店台北敦南",
        "image": "https://lh5.googleusercontent.com/p/AF1QipNoEAFyeoNkjO8wLl5T8f7Iui0ie8sUCFw8MeCR=w408-h306-k-no",
        "start_time": "2024-06-08T16:00:00"
      }
    ]
    setSelectedSchedule({
      schedule: schedule,
      attractions: attractions
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
      {selectedSchedule == null ? <ScheduleList schedules={schedules} toggleModal={toggleModal} toggleSidebar={toggleSidebar} scheduleSelectHandler={scheduleSelectHandler} /> : <AttracionList toggleModal={toggleModal} toggleSidebar={toggleSidebar} selectedSchedule={selectedSchedule} gobackHandler={gobackHandler} />}
    </Box>
  );
};

export default Sidebar;
