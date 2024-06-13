import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Typography } from '@mui/material';

type FavoriteObject = {
    id: number, name: string
}

type FavoriteCardProps = {
    favorite: FavoriteObject;
    index: number;
    handleClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
    favoriteSelectHandler: (favorite: FavoriteObject) => void;
}

const FavoriteCard = ({ favorite, index, handleClick, favoriteSelectHandler }: FavoriteCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleSelect = () => {
        favoriteSelectHandler(favorite);
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
                    {favorite.name}
                </Typography>
            </div>
            <IconButton onClick={(event) => handleClick(event, index)}>
                <MoreVertIcon />
            </IconButton>
        </div>
    )
}

export default FavoriteCard