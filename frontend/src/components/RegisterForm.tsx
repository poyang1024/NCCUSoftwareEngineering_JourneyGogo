import { useState, useRef } from 'react'
import { //Link as RouterLink, 
  useNavigate,
} from 'react-router-dom'
import { // Avatar, 
  Divider,
  Button,
  TextField,
  // Link, 
  Grid,
  Box,
  Typography,
  //Collapse,
  IconButton,
  InputAdornment,
} from '@mui/material'
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm, SubmitHandler } from 'react-hook-form'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ThemeProvider } from '@mui/material/styles';
import authService from '../services/auth.service'
import { useSnackBar } from '../contexts/snackbar'
import { User } from '../models/user'
import { GoogleIcon } from './LoginForm'
import { AxiosError } from 'axios'
import LoginandRegistertheme from '../LoginandRegistertheme'

// const SHOW_EMAIL_REGISTER_FORM: string = import.meta.env.VITE_PWD_SIGNUP_ENABLED

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  //const [expanded, setExpanded] = useState(false)

  // const handleExpandClick = () => {
  //   setExpanded(!expanded)
  // }
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // const onSubmit: SubmitHandler<User> = async (data) => {
  //   try {
  //     await authService.register(data)
  //     showSnackBar('Registration successful.', 'success')
  //     navigate('/login')
  //   } catch (error) {
  //     let msg
  //     if (
  //       error instanceof AxiosError &&
  //       error.response &&
  //       typeof error.response.data.detail == 'string'
  //     )
  //       msg = error.response.data.detail
  //     else if (error instanceof Error) msg = error.message
  //     else msg = String(error)
  //     showSnackBar(msg, 'error')
  //   }
  // }

  const onSubmit: SubmitHandler<User> = async (data) => {

    try {
      if (!emailSubmitted) {
        // await authService.registerCheck(data.email);
        showSnackBar('輸入信箱成功', 'success')
        setEmailSubmitted(true)
      }
      else {
        await authService.register(data)
        showSnackBar('建立帳號成功', 'success')
        navigate('/login')
      }
    } catch (error) {
      let msg
      if (
        error instanceof AxiosError &&
        error.response &&
        typeof error.response.data.detail == 'string'
      )
        msg = error.response.data.detail
      else if (error instanceof Error) msg = error.message
      else msg = String(error)
      showSnackBar(msg, 'error')
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const handleGoogleLogin = async () => {
    window.location.href = authService.getGoogleLoginUrl()
  }

  return (
    <Box
      sx={{
        margin: 1.75,
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
      }}
    >
      {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
      <ThemeProvider theme={LoginandRegistertheme}>
        <Typography component='h1' variant='h5'>
          {emailSubmitted ? '設定帳戶名稱' : '建立帳號'}
        </Typography>
      </ThemeProvider>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>

        {!emailSubmitted ? (
          <TextField
            margin='normal'
            required={false}
            fullWidth
            id='email'
            label='輸入電子信箱'
            autoComplete='email'
            autoFocus
            error={!!errors.email}
            helperText={errors.email && 'Please provide an email address.'}
            {...register('email', { required: true })}
            sx={{
              '& .MuiInputBase-root': { // 直接針對輸入框本體的樣式
                fontFamily: 'Noto Sans TC', // 改變字體
                bgcolor: '#F2F2F2',
                borderRadius: '6px',
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                border: 'none' // 移除邊框
              },
              '& .MuiInputLabel-root': { // 針對標籤的樣式
                fontFamily: 'Noto Sans TC', // 標籤字體
              }
            }}
          />
        ) : (
          <Box>
            <Box>
              <Typography variant='subtitle1' gutterBottom sx={{ mt: 1, color: 'text.secondary', fontFamily: 'Noto Sans TC' }}>
                需使用 6 - 20 個字元
              </Typography>
            </Box>
            <TextField
              autoFocus
              margin='normal'
              required={false}
              fullWidth
              autoComplete='given-name'
              id='firstName'
              label='請輸入帳戶名稱'
              {...register('first_name')}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'Noto Sans TC',
                  bgcolor: '#F2F2F2',
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Noto Sans TC',
                }
              }} />
            <Box>
              <Grid item sx={{ marginTop: 1, }}></Grid>
              <ThemeProvider theme={LoginandRegistertheme}>
                <Typography component='h1' variant='h5'>
                  設定密碼
                </Typography>
              </ThemeProvider>
            </Box>
            <TextField
              margin='normal'
              required={false}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              id='password'
              label='請輸入密碼'
              // autoComplete='new-password'
              error={!!errors.password}
              helperText={errors.password && 'Please provide a password.'}
              //{...register('password', { required: true })}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'Noto Sans TC',
                  bgcolor: '#F2F2F2',
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Noto Sans TC',
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                inputRef: passwordRef
              }}
            />
            <TextField
              margin='normal'
              required={false}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              id='password'
              label='請再次輸入密碼'
              //autoComplete='new-password'
              error={!!errors.password}
              helperText={errors.password && 'Please provide a password.'}
              {...register('password', { required: true })}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'Noto Sans TC',
                  bgcolor: '#F2F2F2',
                  borderRadius: '6px',
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Noto Sans TC',
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                inputRef: passwordRef
              }}
            />
          </Box>
        )}

        {/*Button 的 variant='outlined' 從原本  source code 移除*/}
        <Button type='submit' fullWidth variant='contained' sx={{
          width: 1.0,
          mt: 2,
          boxShadow: 'none',
          bgcolor: '#17CE78',
          fontFamily: 'Noto Sans TC',
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: 15,
          borderRadius: '6px',
          '&:hover': {
            bgcolor: '#32E48E', // Hover 時的背景顏色
            boxShadow: 'none',
          },
        }}
        >
          {/* onClick={handleExpandClick}> */}
          {emailSubmitted ? '建立帳戶' : '使用電子信箱繼續'}
        </Button>
        {/* {emailSubmitted ? (
            <Grid container justifyContent='center'>
              <Grid item sx={{margin: 1.75, fontFamily: 'Noto Sans TC'}}>
                <Link component={RouterLink} to='/' variant='body2'>
                  {"忘記密碼？"}
                </Link>
              </Grid>
            </Grid>
          ) : (
            <Grid item></Grid>
          )} */}
        {!emailSubmitted && (
          <>
            <Divider orientation="horizontal" flexItem sx={{ marginTop: 2.5, }} />

            <Button
              startIcon={<GoogleIcon />}
              sx={{
                width: 1.0, mt: 2, bgcolor: '#333333', borderRadius: '6px', fontFamily: 'Noto Sans TC', color: '#FFFFFF', fontWeight: 500, fontSize: 15,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#4F4F4F', // Hover 時的背景顏色
                  boxShadow: 'none',
                },
              }}
              onClick={handleGoogleLogin}
            >
              或使用 Google 繼續
            </Button>
          </>
        )}
      </Box>

      {/* {SHOW_EMAIL_REGISTER_FORM && SHOW_EMAIL_REGISTER_FORM.toLowerCase() === 'true' && (
          <Button variant='outlined' sx={{ width: 1.0, mt: 2 }} onClick={handleExpandClick}>
            Sign up with your email address
          </Button>
        )} */}

      {/* <Collapse in={expanded} timeout='auto'>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='given-name'
                  fullWidth
                  id='firstName'
                  label='First Name'
                  autoFocus
                  {...register('first_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Last Name'
                  autoComplete='family-name'
                  {...register('last_name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  autoComplete='email'
                  error={!!errors.email}
                  helperText={errors.email && 'Please provide an email address.'}
                  {...register('email', { required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  error={!!errors.password}
                  helperText={errors.password && 'Please provide a password.'}
                  {...register('password', { required: true })}
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link component={RouterLink} to='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Collapse>*/}
    </Box>
  )
}
