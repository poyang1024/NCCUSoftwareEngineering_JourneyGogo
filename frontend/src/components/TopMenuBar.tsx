import { Logout, } from '@mui/icons-material'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

export default function TopMenuBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    setAnchorEl(null)
    navigate('/')
  }
  const Logotheme = createTheme({
    typography: {
      h5: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: "Lexend Deca",
      },
    },
  });
  // color #17CE78
  // Link sx={{ m: 1 }
  return (
    <AppBar position='absolute' sx={{ bgcolor: "#FFFFFF" }} elevation={0}>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2} /> {/* 空的 grid items 用於調整位置 */}
          <Grid item xs={2}>
            <ThemeProvider theme={Logotheme}>
              <Typography component='h1' variant='h5' color='#17CE78' noWrap sx={{ flexGrow: 1 }}>
                <Link component={NavLink} to='/' color='#17CE78' underline='none' >
                  JourneyGogo
                </Link>
              </Typography>
            </ThemeProvider>
          </Grid>

          {user === undefined && (
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button component={NavLink} to='/login' sx={{ color: '#000000' }}>
                Login
              </Button>
              <Button component={NavLink} to='/register' sx={{ color: '#000000' }}>
                Register
              </Button>
            </Grid>
          )}

          {/* {user !== undefined && user.is_superuser && (
            <Button component={NavLink} to='/users' sx={{ color: '#fff' }}>
              Users
            </Button>
          )} */}

          {user !== undefined && (
            <>
              <Grid item xs={2} />
              <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={NavLink} to='/' sx={{ color: '#000000', fontSize: 18, fontWeight: 'medium' }}>
                  通知
                </Button>
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={NavLink} to='/' sx={{ color: '#000000', fontSize: 18, fontWeight: 'medium' }}>
                  收藏
                </Button>
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={NavLink} to='/' sx={{ color: '#000000', fontSize: 18, fontWeight: 'medium' }}>
                  行程
                </Button>
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title='Account settings'>
                  <IconButton
                    onClick={handleClick}
                    size='small'
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <AccountBoxOutlinedIcon fontSize='medium' sx={{ color: "#000000" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </>
          )}

        </Grid>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link component={NavLink} to='/profile' color='inherit' underline='none'>
          <MenuItem onClick={handleClose}>
            <Avatar />
            Profile
          </MenuItem>
        </Link>

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  )
}
