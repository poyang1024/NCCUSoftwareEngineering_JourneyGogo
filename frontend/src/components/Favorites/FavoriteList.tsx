import React, { useState } from 'react';
import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';
import FavoriteService from '../../services/favorite.service'
import FavoriteCard from './FavoriteCard';

type FavoriteObject = {
    id: number, name: string
}

type FavoriteListProps = SideBarProps & {
    favorites: FavoriteObject[];
    toggleModalFavorite: (favorite: FavoriteObject | null, mode: 'add' | 'edit') => void;
    removeFavorite: (id: number) => void;
    favoriteSelectHandler: (favorite: FavoriteObject) => void;
}

const FavoriteList = ({ favorites, toggleModalFavorite, toggleSidebar, removeFavorite, favoriteSelectHandler }: FavoriteListProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        handleClose();
        if (selectedIndex !== null) {
            toggleModalFavorite(favorites[selectedIndex], 'edit');
        }
    };


    const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleClose();
        if (selectedIndex !== null) {
            const favoriteToDelete = favorites[selectedIndex];
            try {
                await FavoriteService.deleteFavorite(favoriteToDelete.id);
                removeFavorite(favoriteToDelete.id);

            } catch (error) {
                console.error('Failed to delete itinerary: ', error);
            }
        }
    };

    return (
        <>
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
            <Typography
                sx={{
                    margin: '85px 20px 20px 20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                }}
            >
                收藏
            </Typography>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '0 20px',
                    marginBottom: '20px',
                }}
            >
                {favorites.map((favorite, index) => (
                    <FavoriteCard key={index} favorite={favorite} index={index} handleClick={handleClick} favoriteSelectHandler={favoriteSelectHandler} />
                ))}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleEdit}>編輯</MenuItem>
                    <MenuItem onClick={handleDelete}>刪除</MenuItem>
                </Menu>
            </Box>
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
                        '&:hover': {
                            bgcolor: '#4F4F4F', // Hover 時的背景顏色
                            boxShadow: 'none',
                          },
                    }}
                    onClick={() => toggleModalFavorite(null, 'add')}
                >
                    + 新增收藏夾
                </Button>
            </Box>
        </>
    )
}

export default FavoriteList