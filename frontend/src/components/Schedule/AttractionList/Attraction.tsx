import React, { useState } from 'react'
import { IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type AttractionObject = {
  attraction_id: number,
  attraction_name: string,
  image: string,
  start_time: string
}

type AttractionProps = {
  attraction: AttractionObject;
  selectedAidhandler: (aid: number) => void;
}

const Attraction = ({ attraction, selectedAidhandler }: AttractionProps) => {

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

  const new_start_time = attraction.start_time.split('T')[1].split(':').slice(0, 2).join(':');
  const new_name = truncateText(attraction.attraction_name, 6);

  const [isHovered, setIsHovered] = useState(false);


  // const handleMoreClick = (event: React.MouseEvent<HTMLElement>, itinerary: { id: number, name: string, startDate: Date | null, endDate: Date | null }) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedItinerary(itinerary);
  // };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "../../../../public/default-image.jpg";
  };

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
    }} onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }} onClick={() => { selectedAidhandler(attraction.attraction_id) }}>
      <div>
        <img src={attraction.image} onError={handleImageError} style={{ width: "100px", height: "100px", borderRadius: "6px", objectFit: "cover" }} />
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
          <IconButton >
            <MoreVertIcon />
          </IconButton>
        </div>
        <p style={{ fontSize: "16px", fontWeight: "500", color: "black" }}>
          {new_name}
        </p>
      </div>
    </div>
  )
}

export default Attraction