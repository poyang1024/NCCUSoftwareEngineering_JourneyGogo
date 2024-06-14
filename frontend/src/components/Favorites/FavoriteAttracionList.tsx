import { useContext } from 'react';
import { Box, IconButton, Typography, Divider } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import SideBarProps from '../../interface/SideBarProps';
import List from './AttractionList/List';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { HomeContext } from '../../contexts/home';

type AttractionObject = {
    attraction_id: number,
    attraction_name: string,
    image: string
}

type AttracionListProps = SideBarProps & {
    gobackHandler: () => void;
}

const FavoriteAttracionList = ({ toggleSidebar, gobackHandler }: AttracionListProps) => {
    // favorite context
    const favoriteContext = useContext(HomeContext);
    if (!favoriteContext) {
        throw new Error('Component must be used within a MyProvider');
    }
    const { selectedFavorite } = favoriteContext;
    if (!selectedFavorite) {
        throw new Error('selectedFavorite is not set.');
    }

    const favorite = selectedFavorite.favorite;
    const attractions = selectedFavorite.attractions;

    return (
        <Box sx={{
            left: '15px'
        }}>
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
            <Box sx={{
                margin: '85px 20px 20px 20px',
            }}>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {favorite.name}
                </Typography>
            </Box>
            <Divider variant='middle' sx={{ borderWidth: "1px" }} />
            <Box
                sx={{
                    overflowY: 'auto',
                    padding: '0 20px',
                    height: 'calc(100vh - 220px)',
                    // bottom shadow
                    boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.15)',
                }}
            >
                <List listId={favorite.id} attractions={attractions} />
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: "10px"
            }}>
                <IconButton onClick={gobackHandler}>
                    <KeyboardBackspaceIcon fontSize='medium' sx={{ color: "black" }} />
                </IconButton>
                <span style={{
                    fontSize: "16px",
                    fontWeight: 500,
                }}>回到所有收藏</span>
            </Box>
        </Box>
    )
}

export default FavoriteAttracionList