import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

interface SelectItineraryDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (itinerary: string) => void;
}

const SelectItineraryDialog: React.FC<SelectItineraryDialogProps> = ({ open, onClose, onSelect }) => {
    const [itineraries, setItineraries] = useState<{ name: string, startDate: Date | null, endDate: Date | null }[]>([]);
    const [newItineraryOpen, setNewItineraryOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItinerary, setSelectedItinerary] = useState<{ name: string, startDate: Date | null, endDate: Date | null } | null>(null);

    const handleAddItinerary = (name: string, startDate: Date | null, endDate: Date | null) => {
        if (name.trim() !== '') {
            setItineraries([...itineraries, { name, startDate, endDate }]);
        }
        setNewItineraryOpen(false);
    };

    const handleSelectItinerary = (itinerary: string) => {
        setSelectedItinerary(itineraries.find(i => i.name === itinerary) || null);
        setTimePickerOpen(true);
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>, itinerary: { name: string, startDate: Date | null, endDate: Date | null }) => {
        setAnchorEl(event.currentTarget);
        setSelectedItinerary(itinerary);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItinerary(null);
    };

    const handleDeleteItinerary = () => {
        if (selectedItinerary) {
            setItineraries(itineraries.filter(itinerary => itinerary.name !== selectedItinerary.name));
        }
        handleMenuClose();
    };

    const handleTimeSelect = () => {
        if (selectedTime && selectedItinerary) {
            onSelect(`${selectedItinerary.name} at ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            setTimePickerOpen(false);
            onClose();
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} PaperProps={{
                style: {
                    height: '487px',
                    width: '350px',
                    borderRadius: '10px',
                }
            }}>
                <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    請選擇行程表
                    <IconButton onClick={onClose} sx={{ color: '#D9D9D9' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            padding: '0 20px',
                            marginBottom: '20px',
                        }}
                    >
                        {itineraries.map((itinerary, index) => (
                            <Box
                                key={index}
                                sx={{
                                    bgcolor: 'rgba(184, 207, 196, 0.15)',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontFamily: 'Noto Sans TC',
                                    color: '#000000',
                                }}
                            >
                                <Box onClick={() => handleSelectItinerary(itinerary.name)} sx={{ cursor: 'pointer' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        {itinerary.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#808080' }}>
                                        {itinerary.startDate?.toLocaleDateString()} - {itinerary.endDate?.toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <IconButton onClick={(event) => handleMoreClick(event, itinerary)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
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
                                fontFamily: 'Noto Sans TC',
                            }}
                            onClick={() => setNewItineraryOpen(true)}
                        >
                            + 新增行程表
                        </Button>
                    </Box>
                </DialogActions>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>編輯</MenuItem>
                    <MenuItem onClick={handleDeleteItinerary} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>刪除</MenuItem>
                </Menu>
            </Dialog>
            <Dialog open={newItineraryOpen} onClose={() => setNewItineraryOpen(false)}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        新增行程表
                        <IconButton onClick={() => setNewItineraryOpen(false)} sx={{ color: '#D9D9D9' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
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
                            value={selectedItinerary?.name || ''}
                            onChange={(e) => setSelectedItinerary(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Typography variant="body1" sx={{ fontSize: '15px', mb: 2, ml: '30px' }}>
                            請選擇行程日期
                        </Typography>
                        <DatePicker
                            label="開始日期"
                            value={selectedItinerary?.startDate}
                            onChange={(date) => setSelectedItinerary(prev => ({ ...prev, startDate: date }))}
                            renderInput={(params) => <TextField {...params} sx={{ width: '354px', ml: '30px', mt: '10px' }} />}
                        />
                        <DatePicker
                            label="結束日期"
                            value={selectedItinerary?.endDate}
                            onChange={(date) => setSelectedItinerary(prev => ({ ...prev, endDate: date }))}
                            renderInput={(params) => <TextField {...params} sx={{ width: '354px', ml: '30px', mt: '10px' }} />}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#18CE79',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#17b36b'
                                }
                            }}
                            onClick={() => handleAddItinerary(selectedItinerary?.name || '', selectedItinerary?.startDate, selectedItinerary?.endDate)}
                        >
                            確定
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#808080',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#6e6e6e'
                                }
                            }}
                            onClick={() => setNewItineraryOpen(false)}
                        >
                            取消
                        </Button>
                    </DialogActions>
                </LocalizationProvider>
            </Dialog>
            <Dialog open={timePickerOpen} onClose={() => setTimePickerOpen(false)}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        請選擇行程時間
                        <IconButton onClick={() => setTimePickerOpen(false)} sx={{ color: '#D9D9D9' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <TimePicker
                            ampm
                            openTo="hours"
                            views={['hours', 'minutes']}
                            inputFormat="hh:mm a"
                            mask="__:__ _M"
                            label="請選擇行程時間"
                            value={selectedTime}
                            onChange={(time) => setSelectedTime(time)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#18CE79',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#17b36b'
                                }
                            }}
                            onClick={handleTimeSelect}
                        >
                            確定
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#808080',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#6e6e6e'
                                }
                            }}
                            onClick={() => setTimePickerOpen(false)}
                        >
                            取消
                        </Button>
                    </DialogActions>
                </LocalizationProvider>
            </Dialog>
        </>
    );
};

export default SelectItineraryDialog;