import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import CloseIcon from '@mui/icons-material/Close';
import ScheduleService from '../../services/schedule.service'
import { Schedule } from '../../models/schedule';

interface Schedule {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

const AddNewSchedule: React.FC<{ open: boolean; onClose: () => void; addSchedule: (name: string, startDate: Date | null, endDate: Date | null) => void }> = ({ open, onClose, addSchedule }) => {
  const [itineraries, setItineraries] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null }[]>([]);
  const [newItineraryOpen, setNewItineraryOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null } | null>(null);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Clear form fields when the dialog is opened
      setName('');
      setStartDate(null);
      setEndDate(null);
      setDateError(null);
    }
  }, [open]);

  useEffect(() => {
    // Enable the submit button only if all fields are filled and startDate is before endDate
    if (name && startDate && endDate && startDate <= endDate) {
      setIsSubmitEnabled(true);
      setDateError(null);
    } else {
      setIsSubmitEnabled(false);
      if (startDate && endDate && startDate > endDate) {
        setDateError('結束日期不能早於開始日期');
      } else {
        setDateError(null);
      }
    }
  }, [name, startDate, endDate]);

  const handleAddItinerary = async () => {
    if (name.trim() !== '' && startDate && endDate) {
        const newItinerary: Schedule = {
            id: selectedItinerary ? selectedItinerary.id : 0,
            name: name,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        };

        console.log('New Itinerary:', newItinerary);

        try {
            if (selectedItinerary) {
                console.log('Updating itinerary...');
                await ScheduleService.updateSchedule(newItinerary.id, newItinerary);
            } else {
                console.log('Creating new itinerary...');
                await ScheduleService.createSchedule(newItinerary);
            }
          
            const updatedItineraries = await ScheduleService.getSchedules();
            const formattedItineraries = updatedItineraries.filter((item): item is Schedule => 'name' in item).map((schedule: Schedule) => ({
                id: schedule.id,
                name: schedule.name,
                startDate: schedule.start_date ? new Date(schedule.start_date) : null,
                endDate: schedule.end_date ? new Date(schedule.end_date) : null
            }));

            setItineraries(formattedItineraries);
            setNewItineraryOpen(false);
            setSelectedItinerary(null);  // Reset selected itinerary after adding/editing
            
            addSchedule(formattedItineraries); // Add the new itinerary to the parent component
            onClose();
        } catch (error) {
            console.error('Failed to save itinerary:', error);
        }
    }
  };

  const handleSelectItinerary = (itineraryName: string) => {
    const itinerary = itineraries.find(i => i.name === itineraryName);
    if (itinerary) {
        setSelectedItinerary(itinerary);
    }
  };

  if (!open) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            width: '474px',
            backgroundColor: 'white',
            borderRadius: '12px',
            p: 4,
            boxSizing: 'border-box',
            overflow: 'auto', 
            maxHeight: '80vh' // Limit the maximum height
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '20px', mb: 2, ml: '30px' }}>
            新增行程表
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 15, ml: '30px' }}>
            請輸入行程表名稱
          </Typography>
          <TextField
            margin="normal"
            variant="standard"
            inputProps={{ style: { fontSize: 15, color: 'rgba(0,0,0,0.87)' }, placeholder: "行程表名稱" }}
            InputLabelProps={{
              shrink: true,
              style: { fontSize: 15 }
            }}
            sx={{
              width: '354px',
              ml: '30px'
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography variant="body1" sx={{ fontSize: '15px', mb: 2, ml: '30px' }}>
            請選擇行程日期
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: '30px', mr: '30px' }}>
            <DatePicker
              label="開始日期"
              slotProps={{ 
                textField: { size: 'small' },
                popper: { placement: 'auto' }
              }}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <Box sx={{ mx: 2 }}> - </Box>
            <DatePicker
              label="結束日期"
              slotProps={{ 
                textField: { size: 'small' },
                popper: { placement: 'auto' }
              }}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
          {dateError && (
            <Typography variant="body2" color="error" sx={{ ml: '30px', mt: 1 }}>
              {dateError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, ml: '30px', mr: '30px', mb: '30px' }}>
            <Button
              variant="contained"
              sx={{
                width: '197px',
                height: '40px',
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#FFFFFF',
                backgroundColor: isSubmitEnabled ? '#18CE79' : '#B2DFDB',
                mr: '20px'
              }}
              onClick={handleAddItinerary}
              disabled={!isSubmitEnabled}
            >
              確定
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                width: '197px',
                height: '40px',
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#FFFFFF',
                backgroundColor: '#808080',
              }}
            >
              取消
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddNewSchedule;