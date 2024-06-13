import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { HomeContext } from '../../contexts/home';
import FavoriteService from '../../services/favorite.service';
import { Favorite } from '../../models/favorite';

type FavoriteObject = {
  id: number, name: string
}

interface AddNewFavoriteProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialFavorite?: FavoriteObject | null;
}


const AddNewFavorite: React.FC<AddNewFavoriteProps> = ({ open, mode, onClose, initialFavorite }) => {
  const [name, setName] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const favoriteContext = useContext(HomeContext);
  if (!favoriteContext) {
    throw new Error('Component must be used within a MyProvider');
  }
  const { setFavorites } = favoriteContext;

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialFavorite) {
        setName(initialFavorite.name);
      } else {
        setName('');
      }
    }
  }, [open, mode, initialFavorite]);

  useEffect(() => {
    // Enable the submit button only if all fields are filled
    if (name) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [name]);

  const handleAddItinerary = async () => {
    if(name.trim() !== ''){
      const newItinerary: Favorite = {
        id: initialFavorite ? initialFavorite.id : 0,
        name: name
      };
      try {
        if (mode === 'edit' && initialFavorite) {
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
        onClose();
      } catch (error) {
        console.error('Failed to save itinerary:', error);
      }
    }   
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: '474px',
          backgroundColor: 'white',
          borderRadius: '12px',
          p: 4,
          boxSizing: 'border-box',
          overflow: 'auto',
          maxHeight: '80vh' // Limit the maximum height
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '20px', mb: 2, ml: '30px' }}>
          新增收藏夾
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 15, ml: '30px' }}>
          請輸入收藏夾名稱
        </Typography>
        <TextField
          margin="normal"
          variant="standard"
          inputProps={{ style: { fontSize: 15, color: 'rgba(0,0,0,0.87)' }, placeholder: "行程表名稱" }}
          InputLabelProps={{
            shrink: true,
            style: { fontSize: 15 }
          }}
          sx={{
            width: '354px',
            ml: '30px'
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, ml: '30px', mr: '30px', mb: '30px' }}>
          <Button
            variant="contained"
            onClick={handleAddItinerary}
            disabled={!isSubmitEnabled}
            sx={{
              width: '197px',
              height: '40px',
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#FFFFFF',
              backgroundColor: '#18CE79',
              '&:hover': {
                backgroundColor: '#17b36b'
              },
              mr: '20px'
            }}
          >
            確定
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              width: '197px',
              height: '40px',
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#FFFFFF',
              backgroundColor: '#808080',
              '&:hover': {
                backgroundColor: '#808080'
              }
            }}
          >
            取消
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewFavorite;
