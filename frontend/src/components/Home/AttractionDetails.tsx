// import { useLoaderData } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'
// import LoginForm from '../../components/LoginForm.tsx';
import { Box, Button, Typography, IconButton, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';

type Feature = {
    img: string;
    alt: string;
    title: string;
    star: string;
    favorite: number;
    address: string;
    phone: string;
    openingHours: { [key: string]: string };
    comments: string[];
};

interface AttractionDetailsProps {
    feature: Feature | null;
    onClose: () => void;
    clickedFavorites: number[];
    handleClickFavorite: (index: number) => void;
}

const AttractionDetails: React.FC<AttractionDetailsProps> = ({ feature, onClose, clickedFavorites, handleClickFavorite }) => {
    if (!feature) {
        return null;
    }

    const { img, alt, title, star, address, phone, openingHours, comments } = feature;
    const isFavorited = clickedFavorites.includes(feature.favorite);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', position: 'relative' }}>
            <img src={img} alt={alt} style={{ width: '60%', borderRadius: '10px' }} />
            <Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Sans TC', marginBottom: '8px' }}>
                    {title}
                </Typography>
                <Box sx={{ marginTop: '20px' }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <StarIcon style={{ color: '#FFE500' }} />
                        <Typography variant="body1" ml={0.5} sx={{ fontFamily: 'Noto Sans TC' }}>
                            {star}
                        </Typography>
                    </Box>
                </Box>
                <Grid container direction='row' spacing={1} alignItems="center">
                    <Grid item>
                        <IconButton size="small" disableRipple>
                            <LocationOnOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC' }}>{address}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <IconButton size="small" sx={{ width: '24px', height: '24px', padding: '6px' }} disableRipple>
                            <CallOutlinedIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC' }}>{phone}</Typography>
                    </Grid>
                </Grid>
                {Object.entries(openingHours).map(([day, hours], index) => (
                    <Grid container spacing={1} key={day} alignItems="center">
                        <Grid item>
                            {index === 0 ? (
                                <IconButton>
                                    <AccessTimeOutlinedIcon />
                                </IconButton>
                            ) : (
                                <IconButton style={{ visibility: 'hidden' }}>
                                    {/* Invisible icon to maintain layout */}
                                    <AccessTimeOutlinedIcon />
                                </IconButton>
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: index === new Date().getDay() ? 'black' : 'gray' }}>
                                {day}: {hours}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}
                <Box
                    sx={{
                        maxHeight: '120px', // Set the height you want for the scrollable area
                        overflowY: 'auto',
                        paddingRight: '16px', // Optional: Add some right padding for better appearance
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Noto Sans TC', fontWeight: 'bold', marginBottom: '4px' }}>
                        評論
                    </Typography>
                    {comments.map((comment, index) => (
                        <Typography key={index} variant="body1" sx={{ fontFamily: 'Noto Sans TC', marginBottom: '8px' }}>
                            {comment}
                        </Typography>
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <IconButton size="small" disableRipple onClick={() => handleClickFavorite(feature.favorite)}>
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '50%', padding: '4px' }}>
                            {isFavorited ? <FavoriteIcon style={{ color: '#000' }} /> : <FavoriteBorderIcon style={{ color: '#000' }} />}
                        </div>
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            borderRadius: '12.5px',
                            fontFamily: 'Noto Sans TC',
                            textTransform: 'none', // Prevent uppercase transformation
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#000000',
                            color: '#FFFFFF'
                        }}
                    >
                        加入行程
                    </Button>
                </Box>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: '10px', right: '10px', color: 'D9D9D9' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </div >
    );
};

export default AttractionDetails; 