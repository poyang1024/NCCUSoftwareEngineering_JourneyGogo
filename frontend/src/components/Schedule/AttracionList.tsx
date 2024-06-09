import { useState } from 'react';
import { Box, IconButton, Typography, Divider, Dialog } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';
import DateList from './AttractionList/DateList';
import AttractionDetails from '../Home/AttractionDetails';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useFeatures } from '../Home/FeatureContext';
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/auth';

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

type AttracionListProps = SideBarProps & {
    selectedSchedule: SelectedSchedule;
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

    return groupedAttractions;
}

const AttracionList = ({ toggleModal, toggleSidebar, selectedSchedule, gobackHandler }: AttracionListProps) => {
    const schedule = selectedSchedule.schedule;
    const attractions = selectedSchedule.attractions;
    const processedAttraction = groupAttractionsByDate(attractions);

    // function for dialog
    const { user } = useAuth()
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAttractionId, setSelectedAttractionId] = useState<number | undefined>(undefined);
    const { features, toggleFavorite } = useFeatures();
    const navigate = useNavigate();


    const handleClickFavorite = (id: number) => {
        if (user) {
            toggleFavorite(id);
        }
    };

    const handleADDialogClose = () => {
        setOpenDialog(false);
        setSelectedAttractionId(undefined);
        // 移除 id 參數但保留其他參數
        const params = new URLSearchParams(location.search);
        params.delete('id');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const selectedAidhandler = (aid: number) => {
        setOpenDialog(true);
        setSelectedAttractionId(aid);
    }

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
                    maxHeight: 'calc(100vh - 220px)',
                    // bottom shadow
                    boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.15)',
                }}
            >
                {processedAttraction.map((attr, index) => (
                    <DateList key={index} date={attr.date} attractions={attr.attractions} selectedAidhandler={selectedAidhandler} />
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
            <Dialog open={openDialog} onClose={handleADDialogClose} maxWidth="md" fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '12px', // 左上和左下有圓角，右上和右下沒有
                    },
                }}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "800px", // 設置固定寬度
                            maxWidth: "800px", // 確保最大寬度也設置為相同值
                            borderRadius: '12px',
                        },
                    },

                }}>
                <AttractionDetails attractionId={selectedAttractionId}
                    onClose={handleADDialogClose}
                    // clickedFavorites={clickedFavorites}
                    // handleClickFavorite={handleClickFavorite}
                    clickedFavorites={features.filter(f => f.favorite === 1).map(f => f.id)}
                    handleClickFavorite={handleClickFavorite} />
            </Dialog>
        </Box>
    )
}

export default AttracionList