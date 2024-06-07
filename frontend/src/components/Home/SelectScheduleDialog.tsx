import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleService from '../../services/schedule.service'
import { Schedule } from '../../models/schedule';

interface SelectScheduleDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (itinerary: string) => void;
    attractionId: number | undefined; // 新增attractionId
}

const SelectScheduleDialog: React.FC<SelectScheduleDialogProps> = ({ open, onClose, onSelect, attractionId }) => {
    const [itineraries, setItineraries] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null }[]>([]);
    const [newItineraryOpen, setNewItineraryOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItinerary, setSelectedItinerary] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null } | null>(null);

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const data = await ScheduleService.getSchedules();
                const formattedItineraries = data.filter((item): item is Schedule => 'name' in item).map((schedule: Schedule) => ({
                    id: schedule.id,
                    name: schedule.name,
                    startDate: schedule.start_date ? new Date(schedule.start_date) : null,
                    endDate: schedule.end_date ? new Date(schedule.end_date) : null
                }));
                setItineraries(formattedItineraries);
            } catch (error) {
                console.error('Failed to fetch itineraries:', error);
            }
        };

        fetchItineraries();
    }, []);

    useEffect(() => {
        if (newItineraryOpen && selectedItinerary) {
            setName(selectedItinerary.name);
            setStartDate(selectedItinerary.startDate);
            setEndDate(selectedItinerary.endDate);
            setDateError(null);
        }
    }, [newItineraryOpen, selectedItinerary]);

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
            } catch (error) {
                console.error('Failed to save itinerary:', error);
            }
        }
    };


    const handleSelectItinerary = (itineraryName: string) => {
        const itinerary = itineraries.find(i => i.name === itineraryName);
        if (itinerary) {
            setSelectedItinerary(itinerary);
            setTimePickerOpen(true);
        }
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>, itinerary: { id: number, name: string, startDate: Date | null, endDate: Date | null }) => {
        console.log('More clicked for itinerary:', itinerary);
        setAnchorEl(event.currentTarget);
        setSelectedItinerary(itinerary);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItinerary(null);
    };

    const handleDeleteItinerary = async () => {
        if (selectedItinerary) {
            try {
                await ScheduleService.deleteSchedule(selectedItinerary.id);
                const updatedItineraries = await ScheduleService.getSchedules();
                const formattedItineraries = updatedItineraries.filter((item): item is Schedule => 'name' in item).map((schedule: Schedule) => ({
                    id: schedule.id,
                    name: schedule.name,
                    startDate: schedule.start_date ? new Date(schedule.start_date) : null,
                    endDate: schedule.end_date ? new Date(schedule.end_date) : null
                }));
                setItineraries(formattedItineraries);
            } catch (error) {
                console.error('Failed to delete itinerary:', error);
            }
            handleMenuClose();
        }
    };

    const handleTimeSelect = async () => {
        if (selectedTime && selectedItinerary && attractionId) {
            try {
                const startTimeISO = selectedTime.toISOString();
                console.log('start time: ', startTimeISO);
                console.log('type of startTimeISO:', typeof startTimeISO);  // 输出 startTimeISO 的类型

                // 如果希望将 startTimeISO 转换为 Date 对象
                const startTimeDate = new Date(startTimeISO);
                console.log('start time as Date object: ', startTimeDate);

                await ScheduleService.addAttractionToSchedule(selectedItinerary.id, attractionId, { start_time: startTimeISO });
                onSelect(`${selectedItinerary.name} at ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            } catch (error) {
                console.error('Failed to add attraction to schedule:', error);
            }
            setTimePickerOpen(false);
            onClose();
        }
    };


    const handleEditItinerary = () => {
        console.log('Edit itinerary:', selectedItinerary);
        setAnchorEl(null); // 關閉菜單
        setNewItineraryOpen(true); // 打開編輯對話框
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
                    {itineraries.length === 0 ? "還沒有新增行程表嗎" : "請選擇行程表"}
                    <IconButton onClick={onClose} sx={{ color: '#D9D9D9' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: itineraries.length === 0 ? 'center' : 'flex-start',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflowY: 'auto',
                            padding: itineraries.length === 0 ? '20px' : '0 20px',
                            marginBottom: '20px',
                        }}
                    >
                        {itineraries.length === 0 ? (
                            <>
                                <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>
                                    還沒新增行程表嗎？
                                </Typography>
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
                                    onClick={() => {
                                        setSelectedItinerary(null);
                                        setNewItineraryOpen(true);
                                    }}
                                >
                                    + 新增行程表
                                </Button>
                            </>
                        ) : (
                            itineraries.map((itinerary, index) => (
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
                                        width: '100%'
                                    }}
                                >
                                    <Box onClick={() => handleSelectItinerary(itinerary.name)} sx={{ cursor: 'pointer', textAlign: 'left' }}>
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
                            ))
                        )}
                    </Box>
                </DialogContent>
                {itineraries.length > 0 && (
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
                                onClick={() => {
                                    setSelectedItinerary(null);
                                    setNewItineraryOpen(true);
                                }}
                            >
                                + 新增行程表
                            </Button>
                        </Box>
                    </DialogActions>
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleDeleteItinerary} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>刪除</MenuItem>
                    <MenuItem onClick={handleEditItinerary} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>編輯</MenuItem>
                </Menu>
            </Dialog>
            <Dialog open={newItineraryOpen} onClose={() => setNewItineraryOpen(false)}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: '10px' }}>
                        {selectedItinerary ? '編輯行程表' : '新增行程表'}
                        <IconButton onClick={() => setNewItineraryOpen(false)} sx={{ color: '#D9D9D9' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ fontSize: 15, ml: '10px' }}>
                            請輸入行程表名稱
                        </Typography>
                        <TextField
                            margin="normal"
                            variant="standard"
                            inputProps={{ style: { fontSize: 15 } }}
                            InputLabelProps={{
                                shrink: true,
                                style: { fontSize: 15 }
                            }}
                            sx={{
                                width: '354px',
                                ml: '10px'
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Typography variant="body1" sx={{ fontSize: '15px', mb: 2, ml: '10px' }}>
                            請選擇行程日期
                        </Typography>
                        <Box display="flex" justifyContent="space-between" sx={{ ml: '10px', width: '354px' }}>
                            <DatePicker
                                label="開始日期"
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                renderInput={(params) => <TextField {...params} sx={{ width: '170px', mt: '10px' }} />}
                                slotProps={{
                                    textField: { size: 'small' },
                                    popper: { placement: 'auto' }
                                }}
                            />
                            <Box sx={{ mx: 1, display: 'flex', alignItems: 'center' }}> - </Box>
                            <DatePicker
                                label="結束日期"
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                renderInput={(params) => <TextField {...params} sx={{ width: '170px', mt: '10px' }} />}
                                slotProps={{
                                    textField: { size: 'small' },
                                    popper: { placement: 'auto' }
                                }}
                            />
                        </Box>
                        {dateError && (
                            <Typography variant="body2" color="error" sx={{ ml: '10px', mt: 1 }}>
                                {dateError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Box display="flex" justifyContent="space-between" sx={{ ml: '10px', width: '354px' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '170px',
                                    backgroundColor: '#18CE79',
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: '#17b36b'
                                    }
                                }}
                                onClick={handleAddItinerary}
                                disabled={!isSubmitEnabled}
                            >
                                確定
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '170px',
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
                        </Box>
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
                    <DialogActions sx={{ justifyContent: 'center' }}>
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

export default SelectScheduleDialog;
