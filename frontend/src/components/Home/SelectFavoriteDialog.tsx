import React, { useState, useEffect, useContext } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteService from '../../services/favorite.service'
import { Favorite } from '../../models/favorite';
import { HomeContext } from '../../contexts/home';

interface SelectFavoriteDialogProps {
    open: boolean;
    onClose: () => void;
    attractionId: number | undefined; // 新增attractionId
}

const SelectFavoriteDialog: React.FC<SelectFavoriteDialogProps> = ({ open, onClose, attractionId }) => {
    // const [favorites, setItineraries] = useState<{ id: number, name: string, startDate: Date | null, endDate: Date | null }[]>([]);
    const [newItineraryOpen, setNewItineraryOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItinerary, setSelectedItinerary] = useState<{ id: number, name: string} | null>(null);

    const [name, setName] = useState('');
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    // seletecFavoriteContext
    const favoriteContext = useContext(HomeContext);
    if (!favoriteContext) {
        throw new Error('Component must be used within a MyProvider');
    }
    const { selectedFavorite, setSelectedFavorite, favorites, setFavorites } = favoriteContext;

    useEffect(() => {
        if (newItineraryOpen && selectedItinerary) {
            setName(selectedItinerary.name);
        }
    }, [newItineraryOpen, selectedItinerary]);

    useEffect(() => {
        // Enable the submit button only if all fields are filled and startDate is before endDate
        if (name) {
            setIsSubmitEnabled(true);
        } else {
            setIsSubmitEnabled(false);
        }
    }, [name]);

    const handleAddItinerary = async () => {
        if (name.trim()) {
            const newItinerary: Favorite = {
                id: selectedItinerary ? selectedItinerary.id : 0,
                name: name,
            };

            try {
                if (selectedItinerary) {
                    await FavoriteService.updateFavorite(newItinerary.id, newItinerary);
                } else {
                    await FavoriteService.createFavorite(newItinerary);
                }

                const updatedItineraries = await FavoriteService.getFavorites();
                const formattedItineraries = updatedItineraries.filter((item): item is Favorite => 'name' in item).map((favorite: Favorite) => ({
                    id: favorite.id,
                    name: favorite.name,
                }));
                setFavorites(formattedItineraries);
                setNewItineraryOpen(false);
                setSelectedItinerary(null);  // Reset selected itinerary after adding/editing
            } catch (error) {
                console.error('Failed to save itinerary:', error);
            }
        }
    };


    const handleFavoriteSelect = async (itineraryName: string) => {
        const itinerary = favorites.find(i => i.name === itineraryName);
        if (itinerary) {
            setSelectedItinerary(itinerary);
        }
        if (selectedItinerary && attractionId) {
            try {
                const new_attraction = await FavoriteService.addAttractionToFavorite(selectedItinerary.id, attractionId);
                // add new_attraction in selectedSchedule.attractions
                if (selectedFavorite) {
                    setSelectedFavorite({
                        favorite: selectedFavorite.favorite,
                        attractions: [...selectedFavorite.attractions, new_attraction]
                    });
                }

            } catch (error) {
                console.error('Failed to add attraction to favorite:', error);
            }
            onClose();
        }
    };


    const handleSelectItinerary = (itineraryName: string) => {
        const itinerary = favorites.find(i => i.name === itineraryName);
        if (itinerary) {
            setSelectedItinerary(itinerary);
        }
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>, itinerary: { id: number, name: string}) => {
        setAnchorEl(event.currentTarget);
        setSelectedItinerary(itinerary);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItinerary(null);
    };

    const handleDeleteItinerary = async () => {
        if (selectedItinerary) {
            try {
                await FavoriteService.deleteFavorite(selectedItinerary.id);
                const updatedItineraries = await FavoriteService.getFavorites();
                const formattedItineraries = updatedItineraries.filter((item): item is Favorite => 'name' in item).map((favorite: Favorite) => ({
                    id: favorite.id,
                    name: favorite.name,
                }));
                setFavorites(formattedItineraries);
            } catch (error) {
                console.error('Failed to delete itinerary:', error);
            }
            handleMenuClose();
        }
    };


    const handleEditItinerary = () => {
        setAnchorEl(null); // 關閉菜單
        setNewItineraryOpen(true); // 打開編輯對話框
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} PaperProps={{
                style: {
                    height: '487px',
                    width: '350px',
                    borderRadius: '10px',
                }
            }}>
                <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {favorites.length === 0 ? "目前尚未新增收藏夾" : "請選擇收藏夾"}
                    <IconButton onClick={onClose} sx={{ color: '#D9D9D9' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: favorites.length === 0 ? 'center' : 'flex-start',
                            alignItems: 'center',
                            textAlign: 'center',
                            overflowY: 'auto',
                            padding: favorites.length === 0 ? '20px' : '0 20px',
                            marginBottom: '20px',
                            height: favorites.length === 0 ? 'calc(50vh - 200px)' : 'auto', // 調整高度
                        }}
                    >
                        {favorites.length === 0 ? (
                            <>
                                <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>
                                    還沒新增收藏夾嗎？
                                </Typography>
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
                                        fontFamily: 'Noto Sans TC',
                                    }}
                                    onClick={() => {
                                        setSelectedItinerary(null);
                                        setNewItineraryOpen(true);
                                    }}
                                >
                                    + 新增收藏夾
                                </Button>
                            </>
                        ) : (
                            favorites.map((itinerary, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        bgcolor: 'rgba(184, 207, 196, 0.15)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontFamily: 'Noto Sans TC',
                                        color: '#000000',
                                        width: '100%'
                                    }}
                                >
                                    <Box onClick={() => handleFavoriteSelect(itinerary.name)} sx={{ cursor: 'pointer', textAlign: 'left' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                                            {itinerary.name}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={(event) => handleMoreClick(event, itinerary)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>
                </DialogContent>
                {favorites.length > 0 && (
                    <DialogActions>
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
                                    fontFamily: 'Noto Sans TC',
                                }}
                                onClick={() => {
                                    setSelectedItinerary(null);
                                    setNewItineraryOpen(true);
                                }}
                            >
                                + 新增收藏夾
                            </Button>
                        </Box>
                    </DialogActions>
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEditItinerary} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>編輯</MenuItem>
                    <MenuItem onClick={handleDeleteItinerary} sx={{ fontFamily: 'Noto Sans TC', color: '#000000' }}>刪除</MenuItem>
                </Menu>
            </Dialog>
            <Dialog open={newItineraryOpen} onClose={() => setNewItineraryOpen(false)}>
                    <DialogTitle sx={{ fontFamily: 'Noto Sans TC', color: '#000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: '10px' }}>
                        {selectedItinerary ? '編輯收藏夾' : '新增收藏夾'}
                        <IconButton onClick={() => setNewItineraryOpen(false)} sx={{ color: '#D9D9D9' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ fontSize: 15, ml: '10px' }}>
                            請輸入收藏夾名稱
                        </Typography>
                        <TextField
                            margin="normal"
                            variant="standard"
                            inputProps={{ style: { fontSize: 15 } }}
                            InputLabelProps={{
                                shrink: true,
                                style: { fontSize: 15 }
                            }}
                            sx={{
                                width: '354px',
                                ml: '10px'
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="space-between" sx={{ ml: '10px', width: '354px' }}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '170px',
                                backgroundColor: '#18CE79',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#17b36b'
                                }
                            }}
                            onClick={handleAddItinerary}
                            disabled={!isSubmitEnabled}
                        >
                            確定
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                width: '170px',
                                backgroundColor: '#6e6e6e',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#808080'
                                }
                            }}
                            onClick={() => setNewItineraryOpen(false)}
                        >
                            取消
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SelectFavoriteDialog;
