import { useContext } from 'react';
import { Box, IconButton, Typography, Divider } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';
import DateList from './AttractionList/DateList';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { HomeContext } from '../../contexts/home';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string,
    start_time: string
}

type AttracionListProps = SideBarProps & {
    gobackHandler: () => void;
}

// process the attraction by start_time: sort by start_time, group by date
function groupAttractionsByDate(attractions: AttractionObject[]) {
    const result: { [date: string]: AttractionObject[] } = {};

    attractions.forEach(attraction => {
        // Extract the date part from the start_time
        const date = attraction.start_time.split('T')[0];

        // If the date is not in the result object, add it with an empty array
        if (!result[date]) {
            result[date] = [];
        }
        // Push the attraction to the appropriate date array
        result[date].push(attraction);
    });
    // Convert the result object to the desired array format
    const groupedAttractions = Object.keys(result).map(date => ({
        date: date,
        attractions: result[date].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    }));
    // sort the groupedAttractions by date
    groupedAttractions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return groupedAttractions;
}

const AttracionList = ({ toggleSidebar, gobackHandler }: AttracionListProps) => {
    // schedule context
    const scheduleContext = useContext(HomeContext);
    if (!scheduleContext) {
        throw new Error('Component must be used within a MyProvider');
    }
    const { selectedSchedule } = scheduleContext;
    if (!selectedSchedule) {
        throw new Error('selectedSchedule is not set.');
    }

    const schedule = selectedSchedule.schedule;
    const attractions = selectedSchedule.attractions;
    const processedAttraction = groupAttractionsByDate(attractions);

    return (
        <Box sx={{
            left: '15px'
        }}>
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
            <Box sx={{
                margin: '85px 20px 20px 20px',
            }}>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {schedule.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#808080' }}>
                    {schedule.startDate?.toLocaleDateString()} - {schedule.endDate?.toLocaleDateString()}
                </Typography>
            </Box>
            <Divider variant='middle' sx={{ borderWidth: "1px" }} />
            <Box
                sx={{
                    overflowY: 'auto',
                    padding: '0 20px',
                    height: 'calc(100vh - 220px)',
                    // bottom shadow
                    boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.15)',
                }}
            >
                {processedAttraction.map((attr, index) => (
                    attr.attractions && <DateList key={index} listId={schedule.id} date={attr.date} attractions={attr.attractions} />
                ))}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: "10px"
            }}>
                <IconButton onClick={gobackHandler}>
                    <KeyboardBackspaceIcon fontSize='medium' sx={{ color: "black" }} />
                </IconButton>
                <span style={{
                    fontSize: "16px",
                    fontWeight: 500,
                }}>回到所有行程</span>
            </Box>
        </Box>
    )
}

export default AttracionList