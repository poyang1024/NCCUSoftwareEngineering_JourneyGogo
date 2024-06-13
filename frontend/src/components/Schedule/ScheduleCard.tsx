import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Typography } from '@mui/material';

type ScheduleObject = {
    id: number, name: string, startDate: Date | null, endDate: Date | null
}

type ScheduleCardProps = {
    schedule: ScheduleObject;
    index: number;
    handleClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
    scheduleSelectHandler: (schedule: ScheduleObject) => void;
}

const ScheduleCard = ({ schedule, index, handleClick, scheduleSelectHandler }: ScheduleCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleSelect = () => {
        scheduleSelectHandler(schedule);
    }
    return (
        <div
            key={index}
            style={{
                width: '100%',
                textAlign: 'left',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                backgroundColor: isHovered ? "rgba(24,206,121,0.15)" : "#F4F8F6",
                padding: '10px',
            }}
            onClick={handleSelect}
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => { setIsHovered(false) }}
        >
            <div >
                <Typography variant="body1" sx={{
                    fontWeight: 'bold', fontSize: '20px'
                }}>
                    {schedule.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#808080' }}>
                    {schedule.startDate?.toLocaleDateString()} - {schedule.endDate?.toLocaleDateString()}
                </Typography>
            </div>
            <IconButton onClick={(event) => handleClick(event, index)}>
                <MoreVertIcon />
            </IconButton>
        </div>
    )
}

export default ScheduleCard