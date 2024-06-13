import React, { useState } from 'react';
import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';
import ScheduleService from '../../services/schedule.service'
import ScheduleCard from './ScheduleCard';

type ScheduleObject = {
    id: number, name: string, startDate: Date | null, endDate: Date | null
}

type ScheduleListProps = SideBarProps & {
    schedules: ScheduleObject[];
    toggleModal: (schedule: ScheduleObject | null, mode: 'add' | 'edit') => void;
    removeSchedule: (id: number) => void;
    scheduleSelectHandler: (schedule: ScheduleObject) => void;
}

const ScheduleList = ({ schedules, toggleModal, toggleSidebar, removeSchedule, scheduleSelectHandler }: ScheduleListProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        handleClose();
        if (selectedIndex !== null) {
            toggleModal(schedules[selectedIndex], 'edit');
        }
    };


    const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleClose();
        if (selectedIndex !== null) {
            const scheduleToDelete = schedules[selectedIndex];
            try {
                await ScheduleService.deleteSchedule(scheduleToDelete.id);
                removeSchedule(scheduleToDelete.id);

            } catch (error) {
                console.error('Failed to delete itinerary: ', error);
            }
        }
    };

    // const removeSchedule = (id: number) => {
    //     setcurrentSchedules(currentSchedules.filter(schedule => schedule.id !== id));
    // }

    return (
        <>
            <IconButton
                onClick={toggleSidebar}
                sx={{
                    position: 'absolute',
                    left: '15px',
                    top: '55px',
                    width: '20px',
                    height: '20px',
                }}
            >
                <ArrowForwardIos sx={{ width: '20px', height: '20px', color: '#AAAAAA' }} />
            </IconButton>
            <Typography
                sx={{
                    margin: '85px 20px 20px 20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                }}
            >
                行程
            </Typography>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '0 20px',
                    marginBottom: '20px',
                }}
            >
                {schedules.map((schedule, index) => (
                    <ScheduleCard key={index} schedule={schedule} index={index} handleClick={handleClick} scheduleSelectHandler={scheduleSelectHandler} />
                ))}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleEdit}>編輯</MenuItem>
                    <MenuItem onClick={handleDelete}>刪除</MenuItem>
                </Menu>
            </Box>
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
                    }}
                    onClick={() => toggleModal(null, 'add')}
                >
                    + 新增行程表
                </Button>
            </Box>
        </>
    )
}

export default ScheduleList