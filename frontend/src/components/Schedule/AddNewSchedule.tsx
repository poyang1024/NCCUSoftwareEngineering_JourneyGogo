import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddNewSchedule: React.FC<{ open: boolean; onClose: () => void; addSchedule: (name: string, startDate: Date | null, endDate: Date | null) => void }> = ({ open, onClose, addSchedule }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (open) {
      // Clear form fields when the dialog is opened
      setName('');
      setStartDate(null);
      setEndDate(null);
    }
  }, [open]);

  const handleSubmit = () => {
    addSchedule(name, startDate, endDate);
    onClose();
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
            height: '323px',
            backgroundColor: 'white',
            borderRadius: '12px',
            p: 4,
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '20px', mb: 2, ml: '30px' }}>
            新增行程表
          </Typography>
          <TextField
            label="請輸入行程表名稱"
            margin="normal"
            variant="standard"
            inputProps={{ style: { fontSize: 15 } }}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, ml: '30px', mr: '30px', mb: '30px' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                width: '197px',
                height: '40px',
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#FFFFFF',
                backgroundColor: '#18CE79',
                mr: '20px'
              }}
            >
              確認
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
