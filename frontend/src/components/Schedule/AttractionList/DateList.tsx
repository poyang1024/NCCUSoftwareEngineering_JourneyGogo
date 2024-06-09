import { Box, Typography } from '@mui/material';
import Attraction from './Attraction';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string,
    start_time: string
}

type DateListProps = {
    date: string;
    listId: number;
    attractions: AttractionObject[];
    selectedAidhandler: (aid: number) => void;
}

const DateList = ({ date, attractions, selectedAidhandler, listId }: DateListProps) => {
    // 判斷date是星期幾
    const dateObj = new Date(date);
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDayStr = weekDay[dateObj.getDay()];
    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()} 星期${weekDayStr}`;
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '10px',
            paddingBottom: '10px',
            gap: '10px',
        }}>
            <Typography variant="body1" sx={{
                fontWeight: 'bold', fontSize: '20px', paddingTop: '10px'
            }}>
                {dateStr}
            </Typography>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>
                {attractions.map((attr, idx) => (
                    <Attraction key={idx} attraction={attr} listId={listId} selectedAidhandler={selectedAidhandler} />
                ))}
            </div>
        </Box>
    )
}

export default DateList