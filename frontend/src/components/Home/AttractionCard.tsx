// import { GitHub } from '@mui/icons-material'
import {
    Box,
    Grid,
    ButtonBase,
    Card,
    IconButton,Button,
    //CardActions,
    CardContent,CardMedia,
    Pagination,PaginationItem,
    Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions
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
import { useNavigate,useLocation,Link} from 'react-router-dom'
// import LoginForm from '../../components/LoginForm.tsx';


type Feature = {
    img: string
    alt: string
    title: string
    star: string
}

type FeaturesCache = {
    date: string
    features: Feature[]
}

const features: Array<Feature> = [
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipNl0iR_cQkLHsnEWADmoxnJNxS-NG3n4BLFjMEY=s680-w680-h510',
        alt: '國立政治大學達賢圖書館',
        title: '國立政治大學達賢圖書館',
        star: "4.8",
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipP2fr_21AVDATmxcSJuOtOYhe3vQStS9ZMO0kgS=s680-w680-h510',
        alt: '邀月茶坊Yaoyue Teahouse',
        title: '邀月茶坊Yaoyue Teahouse',
        star: '4.2',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipNL-OoanDrkbvxkjncRUJvvT7foRqzfTNW7N5Fu=s680-w680-h510',
        alt: 'Purrson Bistro 呼嚕小酒館',
        title: 'Purrson Bistro 呼嚕小酒館',
        star: '4.7',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOK0nqSD6sufCX3-WBekoP04MBW_h4KVeHojY1k=s680-w680-h510',
        alt: '木南公園',
        title: '木南公園',
        star: '3.9',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipMaecM7vUdXbxNBMsCdjL31UN6a5Y773FGbuRY=s680-w680-h510',
        alt: 'Schumann’s BISTRO NO. 6 舒曼六號餐館 動物園政大店｜德國豬腳｜寵物友善',
        title: 'Schumann’s BISTRO NO. 6 舒曼六號餐館 動物園政大店｜德國豬腳｜寵物友善',
        star: '4.2',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: 'Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: 'Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '7Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '7Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '8Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '8Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '9Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '9Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '10Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '10Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '11Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '11Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '12Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '12Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '13Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '13Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '14Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '14Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '15Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '15Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '16Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '16Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '17Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '17Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },
    {
        img: 'https://lh3.googleusercontent.com/p/AF1QipOhgLIku-urUHQ65DUhoetBIjaL8BK-dI7EKxqJ=s680-w680-h510',
        alt: '18Juicy Bun Burger 就是棒 美式餐廳 政大店',
        title: '18Juicy Bun Burger 就是棒 美式餐廳 政大店',
        star: '4.4',
    },

]

export async function loader() {
    const today = new Date().toDateString()
    const cacheValue = localStorage.getItem('farmd-features')
    if (cacheValue !== null) {
        const cache = JSON.parse(cacheValue) as FeaturesCache
        if ('date' in cache && cache.date === today) return { features: cache.features }
    }
    return { features }
}

export default function AttractionCard(){
    const {user} = useAuth()

    // const [clickedLogin, setClickedLogin] = useState(false)
    // const handleClickedLogin = () => {
    //     console.log("Clicked Login...");
    //     setClickedLogin(true);
    // };
    const navigate = useNavigate()
    const handleClickedLogin = () =>{ 
        navigate('/login');
    };


    const [hoverFavoriteIndex, setHoverFavoriteIndex] = useState<number | null>(null);
    const handleHoverFavorite = (index:number, entering:boolean):void => {
      setHoverFavoriteIndex(entering ? index :null);
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
    const handleHoverAdd = (index:number, entering:boolean):void => {
      setHoverAddIndex(entering ? index :null);
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

    const handleChangePage = (event:React.ChangeEvent<unknown>,newPage:number) => {
        navigate(`?page=${newPage}`);
    };


    return (
    <Grid container justifyContent='center' rowSpacing={6} columnSpacing={8} sx={{fontFamily: 'Noto Sans TC'}}>
        {displayedFeatures.map((feature, index) => (
            <Grid item key={feature.title} xs={4} sm={4} md={4}>
            <Card 
                sx={{ 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: '15px',
                boxShadow: "0px 0px 0px 0px",
                paddingRight:1,
                
                }}
            >
                <Box sx={{
                position:'relative',
                padding:0,
                }}
                >
                <ButtonBase>
                    <CardMedia
                    component='img'
                    sx={{
                        height: 250,
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
                        onClick= {()=> {
                            handleClickFavorite(index);
                            if (user === undefined) {
                                handleDialogOpen();
                            }
                        }}
                        onMouseEnter={()=> handleHoverFavorite(index,true)}
                        onMouseLeave={()=> handleHoverFavorite(index,false)}
                        sx={{
                        position:'absolute',
                        top: '3%',
                        right:'2%',
                        color: "#000000",
                        backgroundColor: "#FFFFFF",
                        "&:hover, &.Mui-focusVisible": { 
                            backgroundColor: "#FFFFFF",
                            // color: "#F4F4F4"
                        }
                        }}
                    >
                    {clickedFavorites.includes(index) ? <FavoriteIcon fontSize="inherit"/> : hoverFavoriteIndex === index ? <FavoriteTwoToneIcon fontSize="inherit"/>  : <FavoriteBorderIcon fontSize="inherit"/>}
                    </IconButton >
                    <IconButton
                        size="small"
                        aria-label="add"
                        onMouseEnter={()=> handleHoverAdd(index,true)}
                        onMouseLeave={()=> handleHoverAdd(index,false)}
                        onClick= {()=> {
                            if (user === undefined) {
                                handleDialogOpen();
                            }
                        }}
                        sx={{
                            position:'absolute',
                            top: '17%',
                            right:'2%',
                            color: "#000000",
                            backgroundColor: "#FFFFFF",
                            "&:hover, &.Mui-focusVisible": { 
                                backgroundColor: "#FFFFFF",
                                // color: "#F4F4F4"
                            }
                            }}
                    >
                    {hoverAddIndex === index ? <CreateNewFolderTwoToneIcon fontSize="inherit"/>  : <CreateNewFolderOutlinedIcon fontSize="inherit"/>}
                    </IconButton >
                </Box>
                <CardContent 
                sx={{ flexGrow: 1,
                        fontFamily: 'Noto Sans TC',
                        fontSize: 16,
                        paddingLeft: 0,
                        paddingRight: 0,
                }} 
                >
                <Box gap={2} sx={{display: 'flex', justifyContent: 'space-between',}}>
                    <Box>{feature.title}</Box>
                    <Box>
                    <Box gap={0.5} sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
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
                padding:'30px'
            }}
            sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "370px",  // Set your width here
                    padding:'20px',
                    borderRadius:'12px',
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
                    onClick= {()=> {
                        handleClickedLogin();
                        handleDialogClose();
                        
                    }}
                    sx={{
                        backgroundColor:'#18CE79',
                        color:'#FFFFFF',
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
                        backgroundColor:'#808080',
                        color:'#FFFFFF',
                        '&:hover':{
                            backgroundColor:'#A6A6A6'
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
    </Grid>
    

    )
}