// import { useLoaderData } from 'react-router-dom'
import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'
// import LoginForm from '../../components/LoginForm.tsx';
import { Box, Button, Typography, IconButton, Grid, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useFeatures } from '../../components/Home/FeatureContext.tsx';
import { Attraction } from '../../models/attraction';


// interface AttractionDetailsProps {
//     feature: Feature | null;
//     onClose: () => void;
//     clickedFavorites: number[];
//     handleClickFavorite: (index: number) => void;
// }

type AttractionDetailsProps = {
    feature: Attraction | null;
    onClose: () => void;
    clickedFavorites: number[];
    handleClickFavorite: (id: number) => void;
};

const AttractionDetails: React.FC<AttractionDetailsProps> = ({ feature, onClose, clickedFavorites, handleClickFavorite }) => {
    const { toggleFavorite } = useFeatures();
    const [isFavorited, setIsFavorited] = useState<boolean>(feature?.favorite === 1);

    useEffect(() => {
        if (feature) {
            setIsFavorited(feature.favorite === 1);
        }
    }, [feature]);

    if (!feature) {
        return null;
    }

    const { img, alt, title, star, address, phone, openingHours, comments, id } = feature;
    // const isFavorited = clickedFavorites.includes(feature.favorite);
    const handleFavoriteClick = () => {
        toggleFavorite(id);
        setIsFavorited(!isFavorited); // 更新本地状态以即时反映UI变化
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', position: 'relative' }}>
                <div style={{ width: '65%', borderRadius: '10px 0 0 10px', overflow: 'hidden' }}>
                    <img src={img} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <Box sx={{ width: '35%', paddingLeft: '15px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', position: 'relative' }}>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: '10px', right: '10px', color: 'D9D9D9' }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{
                        maxHeight: '500px', // Set the height you want for the scrollable area
                        overflowY: 'auto',
                        paddingRight: '16px', // Optional: Add some right padding for better appearance
                        marginTop: '40px' // 保證Title在關閉按鈕下方 
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Sans TC' }}>
                            {title}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                            <StarIcon sx={{ marginRight: '10px' }} style={{ color: '#FFE500' }} />
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', fontSize: '18px' }}>
                                {star}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" alignItems="top" mt={2} mb={'12px'}>
                            <LocationOnOutlinedIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', whiteSpace: 'normal' }}>
                                {address}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1} mb={'12px'}>
                            <CallOutlinedIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', whiteSpace: 'normal' }}>
                                {phone}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            {Object.entries(openingHours).map(([day, hours], index) => (
                                <Box display="flex" alignItems="center" mt={1} mb={0} sx={{ paddingRight: '5px' }}>
                                    {index === 0 ? (
                                        <AccessTimeOutlinedIcon sx={{ marginRight: '10px' }} />
                                    ) : (
                                        <AccessTimeOutlinedIcon sx={{ marginRight: '10px' }} style={{ visibility: 'hidden' }} />
                                    )}
                                    <Grid item>
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: index === new Date().getDay() ? 'black' : 'gray' }}>
                                            {day}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: index === new Date().getDay() ? 'black' : 'gray', textAlign: 'right' }}>
                                            {hours}
                                        </Typography>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                        <Divider />
                        <Box mt={2} mb={1}>
                            <Typography variant="subtitle1" sx={{ fontFamily: 'Noto Sans TC', fontWeight: 'medium', marginBottom: '4px', fontSize: '18px' }}>
                                評論
                            </Typography>
                            {comments.map((comment, index) => (
                                <Typography key={index} mb={1} variant="body1" sx={{ fontFamily: 'Noto Sans TC', marginBottom: '8px', borderLeft: 'solid 5px #E6E8EE', paddingLeft: '10px' }}>
                                    {comment}
                                </Typography>
                            ))}
                        </Box>

                        {/* New Button added here */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#AAAAAA',
                                color: '#FFFFFF',
                                fontFamily: 'Noto Sans TC',
                                textTransform: 'none',
                                width: '100%', // Optional: make the button full width
                                marginBottom: '16px' // Space between this button and the bottom buttons
                            }}
                        >
                            至Google Map查看更多
                        </Button>

                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <IconButton size="medium" sx={{ boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.25)' }} disableRipple
                            // onClick={() => handleClickFavorite(feature.favorite)}
                            onClick={handleFavoriteClick}>
                            {isFavorited ? (
                                <FavoriteIcon fontSize="small" sx={{ color: '#000' }} />
                            ) : (
                                <FavoriteBorderIcon fontSize="inherit" sx={{ color: '#000' }} />
                            )}
                        </IconButton>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{
                                height: '40px',
                                borderRadius: '20px',
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
                </Box>
            </div>
        </React.Fragment>
    );

};

export default AttractionDetails; 
