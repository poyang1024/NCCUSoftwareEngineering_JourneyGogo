import { useState } from 'react';
import { Box } from '@mui/material';
import Attraction from './Attraction';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string
}

type DateListProps = {
    listId: number;
    attractions: AttractionObject[];
}

const List = ({ attractions, listId }: DateListProps) => {
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const handleImageError = (index: number) => {
        setImageErrors(new Set(imageErrors.add(index)));
    };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '10px',
            paddingBottom: '10px',
            gap: '10px',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>
                {attractions.map((attr, idx) => (
                    <Attraction key={idx} attraction={attr} listId={listId} handleImageError={handleImageError} hasImageError={imageErrors.has(idx)} idxInList={idx} />
                ))}
            </div>
        </Box>
    )
}

export default List