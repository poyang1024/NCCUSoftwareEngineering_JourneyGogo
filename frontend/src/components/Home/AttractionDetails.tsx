import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, Typography, IconButton, Grid, Divider, Skeleton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useFeatures } from '../../components/Home/FeatureContext.tsx';
import { Attraction } from '../../models/attraction';
import SelectScheduleDialog from './SelectScheduleDialog.tsx';
//import AspectRatio from '@mui/joy/AspectRatio';


// interface AttractionDetailsProps {
//     feature: Feature | null;
//     onClose: () => void;
//     clickedFavorites: number[];
//     handleClickFavorite: (index: number) => void;
// }

type AttractionDetailsProps = {
    attractionId: number | undefined;
    onClose: () => void;
    clickedFavorites: number[];
    handleClickFavorite: (id: number) => void;
};

const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

// const AttractionDetails: React.FC<AttractionDetailsProps> = ({ attractionId, onClose, clickedFavorites, handleClickFavorite }) => {
const AttractionDetails: React.FC<AttractionDetailsProps> = ({ attractionId, onClose, handleClickFavorite }) => {
    // const { getAttractionById, toggleFavorite } = useFeatures();
    const { getAttractionById } = useFeatures();
    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     if (feature) {
    //         setIsFavorited(feature.favorite === 1);
    //     }
    // }, [feature]);

    useEffect(() => {
        if (attractionId !== undefined) {
            const fetchAttraction = async () => {
                try {
                    const data = await getAttractionById(attractionId);
                    setAttraction(data.attraction);
                    setIsFavorited(data.favorite === 1);
                } catch (error) {
                    console.error('Error fetching attraction:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAttraction();
        }
    }, [attractionId, getAttractionById]);

    if (isLoading) {
        return (
            <Box display="flex" flexDirection="row" height="100%">
                <Box width="65%" marginRight="20px">
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
                <Box width="35%" padding="20px">
                    <Skeleton variant="text" height={40} sx={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" height={30} width="80%" sx={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" height={30} width="90%" sx={{ marginBottom: '10px' }} />
                    <Skeleton variant="text" height={30} width="70%" sx={{ marginBottom: '10px' }} />
                    <Skeleton variant="rectangular" width="100%" height={200} />
                </Box>
            </Box>
        );
    }


    if (!attraction) {
        return <Typography variant="body1">Oops! Something went wrong.</Typography>;
    }

    const { pic_url, name, rating, address, phone, business_hour, comments = [], id, tag, url, comment_amount } = attraction;
    const businessHoursArray = business_hour ? business_hour.split(',') : [];

    // 將businessHoursArray按正確順序排列
    const adjustedBusinessHoursArray = [
        businessHoursArray[2], // 星期日
        businessHoursArray[3], // 星期一
        businessHoursArray[4], // 星期二
        businessHoursArray[5], // 星期三
        businessHoursArray[6], // 星期四
        businessHoursArray[0], // 星期五
        businessHoursArray[1], // 星期六
    ];
    // const isFavorited = clickedFavorites.includes(feature.favorite);
    const handleFavoriteClick = () => {
        //toggleFavorite(id);
        handleClickFavorite(id); // 確保狀態在 AttractionCard 同步
        setIsFavorited(!isFavorited); // 更新本地状态以即时反映UI变化

    };

    const handleAddToItineraryClick = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleItinerarySelect = (itinerary: string) => {
        console.log(`Selected itinerary: ${itinerary}`);
        // 在這裡處理將景點添加到選定的行程中
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://clp.org.br/wp-content/uploads/2024/04/default-thumbnail.jpg";
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', position: 'relative' }}>
                <div style={{ width: '65%', borderRadius: '10px 0 0 10px', overflow: 'hidden' }}>
                    <img src={pic_url} alt={name} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            {name}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                            <StarIcon sx={{ marginRight: '10px' }} style={{ color: '#FFE500' }} />
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', fontSize: '18px' }}>
                                {rating}
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', fontSize: '18px', color: 'gray', marginLeft: '10px' }}>
                                評論 ({comment_amount})
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
                            {tag === '飯店' ? (
                                <Box>
                                    <Box display="flex" alignItems="center" mt={1} mb={0} sx={{ paddingRight: '5px' }}>
                                        <AccessTimeOutlinedIcon sx={{ marginRight: '10px' }} />
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: 'black' }}>
                                            入住時間
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: 'black', textAlign: 'right', marginLeft: 'auto' }}>
                                            {businessHoursArray[0]}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mt={1} mb={0} sx={{ paddingRight: '5px' }}>
                                        <AccessTimeOutlinedIcon sx={{ marginRight: '10px', visibility: 'hidden' }} />
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: 'black' }}>
                                            退房時間
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: 'black', textAlign: 'right', marginLeft: 'auto' }}>
                                            {businessHoursArray[1]}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                adjustedBusinessHoursArray.map((hours, index) => (
                                    <Box display="flex" alignItems="center" mt={1} mb={0} sx={{ paddingRight: '5px' }} key={index}>
                                        {index === 0 ? (
                                            <AccessTimeOutlinedIcon sx={{ marginRight: '10px' }} />
                                        ) : (
                                            <AccessTimeOutlinedIcon sx={{ marginRight: '10px' }} style={{ visibility: 'hidden' }} />
                                        )}
                                        <Grid item>
                                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: index === new Date().getDay() ? 'black' : 'gray' }}>
                                                {daysOfWeek[index]}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: index === new Date().getDay() ? 'black' : 'gray', textAlign: 'right' }}>
                                                {hours}
                                            </Typography>
                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </Box>
                        <Divider />
                        <Box mt={2} mb={1}>
                            <Typography variant="subtitle1" sx={{ fontFamily: 'Noto Sans TC', fontWeight: 'medium', marginBottom: '4px', fontSize: '18px' }}>
                                評論
                            </Typography>
                            {comments.slice(0, 5).map((comment, index) => (
                                <Typography key={index} mb={1} variant="body1" sx={{ fontFamily: 'Noto Sans TC', marginBottom: '8px', borderLeft: 'solid 5px #E6E8EE', paddingLeft: '10px' }}>
                                    {truncateText(comment, 20)} {/* Truncate comments to 100 characters */}
                                </Typography>
                            ))}
                        </Box>

                        {/* New Button added here */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#808080',
                                color: '#FFFFFF',
                                fontFamily: 'Noto Sans TC',
                                textTransform: 'none',
                                width: '100%', // Optional: make the button full width
                                marginBottom: '16px', // Space between this button and the bottom buttons
                                '&:hover': {
                                    backgroundColor: '#B0B0B0',
                                    color: '#FFFFFF',
                                },
                                '&:active': {
                                    backgroundColor: '#B0B0B0',
                                    color: '#FFFFFF',
                                }
                            }}
                            onClick={() => window.open(url, '_blank')}
                        >
                            至Google Map查看更多
                        </Button>

                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <IconButton size="medium" sx={{ boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.25)' }} disableRipple
                            // onClick={() => handleClickFavorite(feature.favorite)}
                            onClick={handleFavoriteClick}>
                            {isFavorited ? (
                                <FavoriteIcon fontSize="medium" sx={{ color: '#000' }} />
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
                            onClick={handleAddToItineraryClick}
                        >
                            加入行程
                        </Button>
                    </Box>
                </Box>
            </div>
            <SelectScheduleDialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                onSelect={handleItinerarySelect}
                attractionId={attractionId}
            />
        </React.Fragment>
    );

};

export default AttractionDetails; 
