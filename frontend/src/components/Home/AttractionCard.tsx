import {
    Box,
    Grid,
    ButtonBase,
    Card,
    IconButton, Button,
    //CardActions,
    CardContent, CardMedia,
    Pagination, PaginationItem,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
// import { useLoaderData } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
// import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth.tsx'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AttractionDetails from '../../components/Home/AttractionDetails.tsx';
import { useFeatures } from '../../components/Home/FeatureContext.tsx';


// type Feature = {
//     img: string
//     alt: string
//     title: string
//     star: string
//     favorite: number
// }

type Feature = {
    img: string;
    alt: string;
    title: string;
    star: string;
    favorite: number;
    address: string;
    phone: string;
    openingHours: { [key: string]: string };
    comments: string[];
    id: number;
};


export default function AttractionCard() {
    const { user } = useAuth()

    // const [clickedLogin, setClickedLogin] = useState(false)
    // const handleClickedLogin = () => {
    //     console.log("Clicked Login...");
    //     setClickedLogin(true);
    // };
    // new code to implement favorites shared
    const { features, toggleFavorite } = useFeatures();
    const navigate = useNavigate()
    const handleClickedLogin = () => {
        navigate('/login');
    };


    const [hoverFavoriteIndex, setHoverFavoriteIndex] = useState<number | null>(null);
    const handleHoverFavorite = (index: number, entering: boolean): void => {
        setHoverFavoriteIndex(entering ? index : null);
    };
    const [clickedFavorites, setClickedFavorites] = useState<number[]>([]);
    const handleClickFavorite = (index: number): void => {
        setClickedFavorites(prev => {
            const currentIndex = prev.indexOf(index);
            if (currentIndex !== -1) {
                // 如果已存在，移除它（取消选中）
                return prev.filter(item => item !== index);
            } else {
                // 否则添加到数组中（选中）
                return [...prev, index];
            }
        });
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

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);
    const itemsPerPage = 9;
    const count = Math.ceil(features.length / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedFeatures = features.slice(startIndex, endIndex);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        navigate(`?page=${newPage}`);
    };

    // AttractionDetails
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    const handleCardClick = (feature: Feature) => {
        setSelectedFeature(feature);
        setOpenDialog(true);
        // 新增網址id
        navigate(`?page=${page}&id=${feature.id}`);
    };

    const handleADDialogClose = () => {
        setSelectedFeature(null);
        setOpenDialog(false);
        navigate(`${location.pathname}`);
    };

    useEffect(() => {
        const featureId = query.get('id');
        if (featureId) {
            const selectedFeature = features.find(feature => feature.id === Number(featureId));
            if (selectedFeature) {
                setSelectedFeature(selectedFeature);
                setOpenDialog(true);
            }
        }
    }, [location.search]);



    return (
        <Grid item container justifyContent='center' sx={{ mt: 8, mb: 4 }}>
            <Grid item container xs={2} />
            <Grid item container justifyContent='center' xs={8} rowSpacing={6} columnSpacing={8} sx={{ fontFamily: 'Noto Sans TC' }}>
                {displayedFeatures.map((feature, index) => (
                    <Grid item key={feature.title} xs={4} >
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '15px',
                                boxShadow: "0px 0px 0px 0px",
                                margin: '0px',
                                // paddingRight:1,                        
                            }}
                        >
                            <Box sx={{
                                width: '100%',
                                position: 'relative',
                                padding: 0,
                            }}
                            >
                                <ButtonBase onClick={() => handleCardClick(feature)}>
                                    <CardMedia
                                        component='img'
                                        sx={{
                                            // width: '100%',
                                            height: 300,
                                            padding: 0,
                                            // objectFit: 'contain',
                                            fontFamily: 'Noto Sans TC',
                                            fontSize: 14,
                                            borderRadius: '15px',

                                        }}
                                        image={feature.img}
                                        title={feature.alt}
                                    />
                                </ButtonBase>
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
                                        onClick={() => handleCardClick(feature)}
                                    >
                                        {feature.title}
                                    </ButtonBase>
                                    <Box>
                                        <Box gap={0.5} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <StarIcon sx={{ color: "#FFE500" }} fontSize={'small'} />
                                            {feature.star}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Pagination
                    count={count}
                    page={page}
                    onChange={handleChangePage}
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
                            to={`/${item.page === 1 ? '' : `?page=${item.page}`}`}
                            {...item}
                        />
                    )}
                />

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
                <Dialog open={openDialog} onClose={handleADDialogClose} maxWidth="md" fullWidth
                    PaperProps={{
                        style: {
                            borderRadius: '12px', // 左上和左下有圓角，右上和右下沒有
                        },
                    }}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "100%",
                                borderRadius: '12px',
                            },
                        },

                    }}>
                    <AttractionDetails feature={selectedFeature}
                        onClose={handleADDialogClose}
                        // clickedFavorites={clickedFavorites}
                        // handleClickFavorite={handleClickFavorite}
                        clickedFavorites={features.filter(f => f.favorite === 1).map(f => f.id)}
                        handleClickFavorite={(id) => toggleFavorite(id)} />
                </Dialog>
            </Grid>
            <Grid item container xs={2} />
        </Grid>


    )
}
