import React, { useState, useContext } from 'react'
import { IconButton, Dialog, DialogTitle, DialogActions, DialogContent, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttrEditMenu from './AttrEditMenu';
import CustomActionBtn from '../../UI/CustomActionBtn';
import favoriteService from '../../../services/favorite.service';
import { HomeContext } from '../../../contexts/home';
import { useSnackBar } from '../../../contexts/snackbar';
import timeService from '../../../services/time.service';
import ImageIcon from '@mui/icons-material/Image';

type AttractionObject = {
  attraction_id: number,
  attraction_name: string,
  image: string,
  start_time: string
}

type AttractionProps = {
  idxInList: number;
  attraction: AttractionObject;
  listId: number;
  handleImageError: (index: number) => void;
  hasImageError: boolean;
}

const Attraction = ({ attraction, listId, handleImageError, idxInList, hasImageError }: AttractionProps) => {
  // favorite context
  const homeContext = useContext(HomeContext);
  if (!homeContext) {
    throw new Error('Component must be used within a MyProvider');
  }
  const { selectedFavorite, setSelectedFavorite, setSelectedAttractionId, setOpenDetailDialog } = homeContext;

  const [isHovered, setIsHovered] = useState(false);
  const { showSnackBar } = useSnackBar();

  // control the edit menu component
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const attractionEditHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  // for dialog
  const [open, setOpen] = useState(false);
  // control the dialog content
//   const [tappedMenu, setTappedMenu] = useState(true); // [true: 'delete', false: 'edit']
  // control the open and close of the menu
  const attrEditHandler = () => {
    setAnchorEl(null);
    setOpen(true);
  }
  // handle the action of delete and edit
  const handleConfirm = async () => {
    setOpen(false)
    if (!selectedFavorite) return
    if (selectedFavorite.attractions.length === 1) {
        showSnackBar('行程表中至少要有一個行程！', 'error')
        return
      }
      // delete the attraction
      const res = await favoriteService.deleteFavoriteAttraction(listId, attraction.attraction_id)
      const deletedAid = res.attraction
      // filter the selectedFavorite by deletedAid
      const filteredAttractions = selectedFavorite.attractions.filter(attr => attr.attraction_id !== deletedAid)
      // update the selectedFavorite
      setSelectedFavorite({
        ...selectedFavorite,
        attractions: filteredAttractions
      })
  }

  // handle the attraction detail click
  const imageClickHandler = () => {
    setSelectedAttractionId(attraction.attraction_id)
    setOpenDetailDialog(true)
  }



  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      borderRadius: '6px',
      backgroundColor: isHovered ? "rgba(24,206,121,0.15)" : "#F4F8F6",
      padding: '10px',
      width: '100%',
      justifyContent: "space-between",
      // set the width ratio inside the child element
    }} onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
      <div style={{ flex: 1 }}>
        {hasImageError ?
          <div style={{
            width: "100px",
            height: "100px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E5E5E5',
            borderRadius: '6px',
          }} onClick={imageClickHandler} >
            <ImageIcon style={{ fontSize: 50, color: '#BDBDBD' }} />
          </div> : <img src={attraction.image} style={{ width: "100px", height: "100px", borderRadius: "6px", objectFit: "cover" }} onClick={imageClickHandler} onError={() => handleImageError(idxInList)} />}
      </div>
      <div style={{ flex: 2 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <div style={{
            // make two elements in the same line
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            color: "#18CE79",
            gap: '5px',
            width: '100%'
          }}>
            <Typography variant="body1" sx={{
                fontSize: "16px",
                fontWeight: "500",
                color: "black",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                }}>
                {attraction.attraction_name}
            </Typography>
          </div>
          <>
            <IconButton onClick={attractionEditHandler} >
              <MoreVertIcon />
            </IconButton>
            <AttrEditMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} attrEditHandler={attrEditHandler} />
          </>
        </div>
        
      </div>
      <Dialog
        open={open}
        onClose={() => { setOpen(false) }}
        aria-describedby='alert-profile-dialog-description'
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle id='alert-dialog-title'>
          <p style={{ fontSize: "20px", fontWeight: 500, color: "#000000" }}>'刪除行程'</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#000000" }}>
            確定將「${attraction.attraction_name}」刪除？
          </p>
        </DialogTitle>
        
        <DialogActions sx={{ paddingLeft: "24px", paddingRight: "24px", paddingBottom: "20px", display: 'flex', justifyContent: 'space-between', gap: "1rem" }} >
          <CustomActionBtn
            onClick={() => { handleConfirm}}
            sx={{
              backgroundColor:'#18CE79',
              flex: 1,
              flexGrow: 1,
            }}
            hoverBackgroundColor={'#32E48E'}
          >
            確認刪除
          </CustomActionBtn>
          <CustomActionBtn
            onClick={() => { setOpen(false) }}
            sx={{
              backgroundColor: "#808080",
              flex: 1,
              flexGrow: 1,
            }}
            hoverBackgroundColor='#B0B0B0'
          >
            取消
          </CustomActionBtn>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Attraction