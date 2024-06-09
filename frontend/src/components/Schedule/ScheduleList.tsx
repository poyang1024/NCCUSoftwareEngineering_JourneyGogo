import { Box, IconButton, Typography, Button, ButtonBase } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';

type ScheduleObject = {
    id: number, name: string, startDate: Date | null, endDate: Date | null
}

type ScheduleListProps = SideBarProps & {
    schedules: ScheduleObject[];
    scheduleSelectHandler: (schedule: ScheduleObject) => void;
}

const ScheduleList = ({ schedules, toggleModal, toggleSidebar, scheduleSelectHandler }: ScheduleListProps) => {
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
                    <ButtonBase
                        key={index}
                        onClick={() => scheduleSelectHandler(schedule)}
                        sx={{
                            width: '100%',
                            textAlign: 'left',
                            borderRadius: '8px',
                            display: 'block',
                            marginBottom: '10px',
                            bgcolor: 'rgba(184, 207, 196, 0.15)',
                            padding: '10px',
                            '&:hover': {
                                bgcolor: 'rgba(24, 206, 121, 0.1)',
                            }
                        }}
                    >
                        <Typography variant="body1" sx={{
                            fontWeight: 'bold', fontSize: '20px'
                        }}>
                            {schedule.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#808080' }}>
                            {schedule.startDate?.toLocaleDateString()} - {schedule.endDate?.toLocaleDateString()}
                        </Typography>
                    </ButtonBase>
                ))}
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
                    onClick={toggleModal}
                >
                    + 新增行程表
                </Button>
            </Box>
        </>
    )
}

export default ScheduleList