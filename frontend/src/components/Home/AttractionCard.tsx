import {
    Box,
    Grid,
    ButtonBase,
    Card,
    IconButton, Button,
    CardActionArea,
    CardContent, CardMedia,
    Skeleton,
    Typography,
    Pagination, PaginationItem,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
// import AspectRatio from '@mui/joy/AspectRatio';

// import { useLoaderData } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ImageIcon from '@mui/icons-material/Image';
// import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { useState, useContext } from 'react';
import { useAuth } from '../../contexts/auth.tsx'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AttractionDetails from '../../components/Home/AttractionDetails.tsx';
import { useFeatures } from '../../components/Home/FeatureContext.tsx';
//import { Attraction } from '../../models/attraction';
import SelectScheduleDialog from './SelectScheduleDialog.tsx';
import { HomeContext } from '../../contexts/home.tsx';


export default function AttractionCard() {
    const { user } = useAuth()

    // new code to implement favorites shared
    const { features, isLoading, toggleFavorite, setSkipNextFetch} = useFeatures();
    const navigate = useNavigate()
    const handleClickedLogin = () => {
        navigate('/login');
    };


    const [hoverFavoriteIndex, setHoverFavoriteIndex] = useState<number | null>(null);
    const handleHoverFavorite = (index: number, entering: boolean): void => {
        setHoverFavoriteIndex(entering ? index : null);
    };

    const [hoverAddIndex, setHoverAddIndex] = useState<number | null>(null);
    const handleHoverAdd = (index: number, entering: boolean): void => {
        setHoverAddIndex(entering ? index : null);
    };

    const [open, setOpen] = useState(false)
    const handleDialogOpen = () => {
        console.log("Opening dialog...");
        setOpen(true);
    };
    const handleDialogClose = () => {
        setOpen(false);
    };

    // load the context that control the add attraction dialog
    const DialogContext = useContext(HomeContext);
    if (!DialogContext) {
        throw new Error('Component must be used within a MyProvider');
    }
    const { openAddDialog, setOpenAddDialog, openDetailDialog, setOpenDetailDialog, selectedAttractionId, setSelectedAttractionId } = DialogContext;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);
    const city = query.get('city') || '';
    const keyword = query.get('keyword') || '';
    const itemsPerPage = 9;
    const count = Math.ceil(features.length / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedFeatures = features.slice(startIndex, endIndex);
    const emptyCardCount = itemsPerPage - displayedFeatures.length;

    const buildUrl = (city: string, keyword: string, page: number) => {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (keyword) params.append('keyword', keyword);
        params.append('page', page.toString())
        return `?${params.toString()}`;
    };

    const handleChangePage = (newPage: number) => {
        setSkipNextFetch(true);
        setImageErrors(new Set()); // Reset image errors when changing page
        navigate(buildUrl(city, keyword, newPage));
    };

    const handleCardClick = (id: number) => {
        setSkipNextFetch(true); // 避免在開啟時觸發抓取
        setSelectedAttractionId(id);
        setOpenDetailDialog(true);
        // 更新 URL 參數
        const params = new URLSearchParams(location.search);
        params.set('id', id.toString());
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const handleClickFavorite = (id: number) => {
        if (user) {
            toggleFavorite(id);
        } else {
            setOpen(true);
        }
    };

    // 用來關閉 AttractionDetails dialog
    const handleADDialogClose = () => {
        setSkipNextFetch(true); // 避免在關閉時觸發抓取
        setOpenDetailDialog(false);
        setSelectedAttractionId(undefined);
        // 移除 id 參數但保留其他參數
        const params = new URLSearchParams(location.search);
        params.delete('id');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };
    
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const handleImageError = (index: number) => {
        setImageErrors(new Set(imageErrors.add(index)));
    };



    const handleAddDialogState = (status: boolean) => {
        if (status === false) {
            setSelectedAttractionId(undefined);
        }
        setOpenAddDialog(status);
    }


    return (
        <Grid item container justifyContent='center' sx={{ mt: 8, mb: 4 }}>
            <Grid item container xs={2} />
            <Grid item container justifyContent='center' xs={8} rowSpacing={6} columnSpacing={8} sx={{ fontFamily: 'Noto Sans TC' }}>
                {isLoading ? (
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                            <Grid item key={index} xs={4}>
                                <Skeleton 
                                variant="rectangular" 
                                sx={{
                                    height: '30vh',
                                    borderRadius: '15px',
                                }} />
                                <Skeleton height={40} sx={{marginTop:'10px'}}/>
                            </Grid>
                        ))
                    ) : displayedFeatures.length > 0 ? (
                        <>
                        {displayedFeatures.map((feature, index) => (
                            <Grid item key={feature.name} xs={4} >
                                <Card
                                    sx={{
                                        borderRadius: '15px',
                                        boxShadow: 0,                        
                                    }}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        position: 'relative',
                                        padding: 0,
                                    }}
                                    >
                                        <CardActionArea>
                                            {!imageErrors.has(index) ? (
                                                <CardMedia
                                                    component='img'
                                                    // height="300"
                                                    width='auto'
                                                    onClick={() => handleCardClick(feature.id)}
                                                    sx={{
                                                        height: '30vh',
                                                        fontFamily: 'Noto Sans TC',
                                                        fontSize: 14,
                                                        borderRadius: '15px',
                                                        backgroundColor: 'E5E5E5',
                                                    }}
                                                    image={feature.pic_url}
                                                    onError={() => handleImageError(index)}
                                                    title={feature.name}
                                                />
                                            ) : (
                                                <Box 
                                                onClick={() => handleCardClick(feature.id)}
                                                sx={{
                                                    height: '30vh',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#E5E5E5',
                                                    borderRadius: '15px',
                                                }}>
                                                    <ImageIcon style={{ fontSize: 80, color: '#BDBDBD' }} />
                                                </Box>
                                            )}
                                        </CardActionArea> 
                                        <IconButton
                                            size="small"
                                            aria-label="favorite"
                                            onClick={() => {
                                                //handleClickFavorite(index);
                                                toggleFavorite(feature.id);
                                                if (user === undefined) {
                                                    handleDialogOpen();
                                                }
                                            }}
                                            onMouseEnter={() => handleHoverFavorite(index, true)}
                                            onMouseLeave={() => handleHoverFavorite(index, false)}
                                            sx={{
                                                position: 'absolute',
                                                top: '3%',
                                                right: '2%',
                                                color: "#000000",
                                                backgroundColor: "#FFFFFF",
                                                "&:hover, &.Mui-focusVisible": {
                                                    backgroundColor: "#FFFFFF",
                                                    // color: "#F4F4F4"
                                                }
                                            }}
                                        >
                                            {user === undefined ?
                                                (hoverFavoriteIndex === index ? <FavoriteTwoToneIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />) :
                                                feature.favorite === 1 ?
                                                    // <FavoriteIcon fontSize="inherit" /> :
                                                    // clickedFavorites.includes(index) ?
                                                    <FavoriteIcon fontSize="inherit" /> :
                                                    (hoverFavoriteIndex === index ? <FavoriteTwoToneIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />)
                                            }
                                        </IconButton >
                                        <IconButton
                                            size="small"
                                            aria-label="add"
                                            onMouseEnter={() => handleHoverAdd(index, true)}
                                            onMouseLeave={() => handleHoverAdd(index, false)}
                                            onClick={() => {
                                                if (user === undefined) {
                                                    handleDialogOpen();
                                                }
                                                else {
                                                    setSelectedAttractionId(feature.id);
                                                    handleAddDialogState(true);
                                                }
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: '17%',
                                                right: '2%',
                                                color: "#000000",
                                                backgroundColor: "#FFFFFF",
                                                "&:hover, &.Mui-focusVisible": {
                                                    backgroundColor: "#FFFFFF",
                                                    // color: "#F4F4F4"
                                                }
                                            }}
                                        >
                                            {hoverAddIndex === index ? <CreateNewFolderTwoToneIcon fontSize="inherit" /> : <CreateNewFolderOutlinedIcon fontSize="inherit" />}
                                        </IconButton >
                                    </Box>
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            fontFamily: 'Noto Sans TC',
                                            fontSize: 16,
                                            paddingLeft: 0,
                                            paddingRight: 0,
                                        }}
                                    >
                                        <Box gap={2} sx={{ display: 'flex', justifyContent: 'space-between', }}>
                                            <ButtonBase sx={{
                                                fontFamily: 'Noto Sans TC',
                                                fontSize: 16,
                                                textAlign: 'left'
                                            }}
                                                onClick={() => handleCardClick(feature.id)}
                                            >
                                                {feature.name}
                                            </ButtonBase>
                                            <Box>
                                                <Box gap={0.5} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <StarIcon sx={{ color: "#FFE500" }} fontSize={'small'} />
                                                    {feature.rating}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {/* Render empty cards */}
                        {Array.from({ length: emptyCardCount }).map((_, index) => (
                            <Grid item key={`empty-${index}`} xs={4}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '15px',
                                        boxShadow: "0px 0px 0px 0px",
                                        margin: '0px',
                                        backgroundColor: '#ffffff', // Light gray background for empty cards
                                    }}
                                />
                            </Grid>
                        ))}
                        <Pagination
                            count={count}
                            page={page}
                            onChange={(_, value) => handleChangePage(value)}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    '&.Mui-selected': {
                                        backgroundColor: "#DDF8EB",
                                        color: '#18CE79',
                                        // borderRadius: '50%',
                                    },
                                },
                            }}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    to={buildUrl(city, keyword, item.page || 1)}
                                    {...item}
                                />
                            )}
                        />
                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '500px',
                            mt: 4
                        }}
                    >
                        <Typography variant="body1">
                            查無結果
                        </Typography>
                    </Box>
                )}


                <Dialog
                    open={open}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    style={{
                        padding: '30px'
                    }}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "370px",  // Set your width here
                                padding: '20px',
                                borderRadius: '12px',
                            },
                        },

                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        {"尚未登入"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            是否前往登入？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                handleClickedLogin();
                                handleDialogClose();

                            }}
                            sx={{
                                backgroundColor: '#18CE79',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#32E48E',
                                }
                            }}
                            autoFocus
                        >
                            前往
                        </Button>
                        <Button
                            onClick={handleDialogClose}
                            sx={{
                                backgroundColor: '#808080',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#A6A6A6'
                                }
                            }}
                        >
                            取消
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* <Dialog>
            <LoginForm/>
        </Dialog> */}
                <Dialog 
                    open={openDetailDialog} 
                    onClose={handleADDialogClose} 
                    maxWidth="md" 
                    fullWidth
                    PaperProps={{
                        style: {
                            borderRadius: '12px', // 左上和左下有圓角，右上和右下沒有
                        },
                    }}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "65vw", // 設置固定寬度
                                maxWidth: "65vw", // 確保最大寬度也設置為相同值
                                borderRadius: '12px'
                            },
                        },

                    }}>
                    <AttractionDetails attractionId={selectedAttractionId}
                        onClose={handleADDialogClose}
                        clickedFavorites={features.filter(f => f.favorite === 1).map(f => f.id)}
                        handleClickFavorite={handleClickFavorite} handleAddDialogState={handleAddDialogState} />
                </Dialog>
            </Grid>
            <Grid item container xs={2} />
            <SelectScheduleDialog
                open={openAddDialog}
                onClose={() => { handleAddDialogState(false) }}
                attractionId={selectedAttractionId}
            />
        </Grid>


    )
}
