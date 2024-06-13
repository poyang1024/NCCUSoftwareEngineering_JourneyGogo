import React, { useState, useContext } from 'react'
import { IconButton, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttrEditMenu from './AttrEditMenu';
import CustomActionBtn from '../../UI/CustomActionBtn';
import scheduleService from '../../../services/schedule.service';
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

const truncateText = (text: string, maxLength: number) => {
  let truncatedText = text;
  let charCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // eslint-disable-next-line no-control-regex
    if (char.match(/[^\x00-\xff]/g)) {
      // Chinese or non-ASCII character
      charCount += 1;
    } else {
      // English or ASCII character
      charCount += 0.5;
    }
    if (charCount > maxLength) {
      truncatedText = text.substring(0, i) + '...';
      break;
    }
  }
  return truncatedText;
};

const Attraction = ({ attraction, listId, handleImageError, idxInList, hasImageError }: AttractionProps) => {
  // schedule context
  const homeContext = useContext(HomeContext);
  if (!homeContext) {
    throw new Error('Component must be used within a MyProvider');
  }
  const { selectedSchedule, setSelectedSchedule, setSelectedAttractionId, setOpenDetailDialog } = homeContext;

  const new_start_time = attraction.start_time.split('T')[1].split(':').slice(0, 2).join(':');
  const new_name = truncateText(attraction.attraction_name, 6);

  const [isHovered, setIsHovered] = useState(false);
  const { showSnackBar } = useSnackBar();

  // control the edit menu component
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const attractionEditHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  // state and function for datetime picker
  const [selectedDatetime, setSelectedDatetime] = useState<Date>(new Date(attraction.start_time));
  const handleDateChange = (date: Date | null) => {
    date && setSelectedDatetime(date);
  };

  // for dialog
  const [open, setOpen] = useState(false);
  // control the dialog content
  const [tappedMenu, setTappedMenu] = useState(true); // [true: 'delete', false: 'edit']
  // control the open and close of the menu
  const attrEditHandler = (status: boolean) => {
    setAnchorEl(null);
    setTappedMenu(status);
    setOpen(true);
  }
  // handle the action of delete and edit
  const handleConfirm = async (tappedMenu: boolean) => {
    setOpen(false)
    if (!selectedSchedule) return
    if (tappedMenu) {
      if (selectedSchedule.attractions.length === 1) {
        showSnackBar('行程表中至少要有一個行程！', 'error')
        return
      }
      // delete the attraction
      const res = await scheduleService.deleteScheduleAttraction(listId, attraction.attraction_id)
      const deletedAid = res.attraction
      // filter the selectedSchedule by deletedAid
      const filteredAttractions = selectedSchedule.attractions.filter(attr => attr.attraction_id !== deletedAid)
      // update the selectedSchedule
      setSelectedSchedule({
        ...selectedSchedule,
        attractions: filteredAttractions
      })
    }
    else {
      // edit time of the attraction
      const formatedDate = timeService.formatTime(selectedDatetime);
      const res = await scheduleService.updateScheduleAttraction(listId, attraction.attraction_id, { start_time: formatedDate })
      const editAid = res.attraction
      // find the attraction which id is equal to editAid and update the start_time
      const updatedAttractions = selectedSchedule.attractions.map(attr => {
        if (attr.attraction_id === editAid) {
          return {
            ...attr,
            start_time: formatedDate
          }
        }
        return attr
      })
      // update the selectedSchedule
      setSelectedSchedule({
        ...selectedSchedule,
        attractions: updatedAttractions
      })
    }
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
      //hover effect
    }} onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
      <div>
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
      <div>
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
            <AccessTimeIcon />
            <span style={{ fontSize: "16px", fontWeight: "500" }}>
              {new_start_time}
            </span>
          </div>
          <>
            <IconButton onClick={attractionEditHandler} >
              <MoreVertIcon />
            </IconButton>
            <AttrEditMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} attrEditHandler={attrEditHandler} />
          </>
        </div>
        <p style={{ fontSize: "16px", fontWeight: "500", color: "black" }}>
          {new_name}
        </p>
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
          <p style={{ fontSize: "20px", fontWeight: 500, color: "#000000" }}>{tappedMenu ? '刪除行程' : '更改時間'}</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#000000" }}>
            {tappedMenu ? `確定將 ${new_start_time} 行程「${attraction.attraction_name}」刪除？` : '請選擇行程時間'}
          </p>
        </DialogTitle>
        {tappedMenu ?
          null :
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DialogContent>
              <DateTimePicker
                views={['year', 'month', 'day', 'hours', 'minutes']}
                sx={{ width: "100%" }}
                value={selectedDatetime}
                onChange={handleDateChange}
              />
            </DialogContent>
          </LocalizationProvider>
        }
        <DialogActions sx={{ paddingLeft: "24px", paddingRight: "24px", paddingBottom: "20px", display: 'flex', justifyContent: 'space-between', gap: "1rem" }} >
          <CustomActionBtn
            onClick={() => { handleConfirm(tappedMenu) }}
            sx={{
              backgroundColor: tappedMenu ? '#FF2B2B' : '#18CE79',
              flex: 1,
              flexGrow: 1,
            }}
            hoverBackgroundColor={tappedMenu ? '#FF5353' : '#32E48E'}
          >
            {tappedMenu ? '確認刪除' : '確認'}
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