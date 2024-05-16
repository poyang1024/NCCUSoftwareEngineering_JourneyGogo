import { useState, useRef } from 'react'
import {
  Box,
  //Avatar,
  Divider,
  Typography,
  Button,
  TextField,
  Link,
  Grid,
  SvgIcon,
  SvgIconProps,
  //Collapse,
  IconButton,
  InputAdornment,
} from '@mui/material'
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSnackBar } from '../contexts/snackbar'
import { useAuth } from '../contexts/auth'
import authService from '../services/auth.service'
import { User } from '../models/user'
import { AxiosError } from 'axios'
import LoginandRegistertheme from '../LoginandRegistertheme.tsx'
// import CustomTextField from './UI/CustomTextField.tsx';

export function GoogleIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 48 48'>
      <path
        fill='#FFC107'
        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
      ></path>
      <path
        fill='#FF3D00'
        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
      ></path>
      <path
        fill='#4CAF50'
        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
      ></path>
      <path
        fill='#1976D2'
        d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
      ></path>
    </SvgIcon>
  )
}

export function FacebookIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 48 48'>
      <linearGradient
        id='Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1'
        x1='9.993'
        x2='40.615'
        y1='9.993'
        y2='40.615'
        gradientUnits='userSpaceOnUse'
      >
        <stop offset='0' stopColor='#2aa4f4'></stop>
        <stop offset='1' stopColor='#007ad9'></stop>
      </linearGradient>
      <path
        fill='url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)'
        d='M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z'
      ></path>
      <path
        fill='#fff'
        d='M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z'
      ></path>
    </SvgIcon>
  )
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const { login } = useAuth()

  const handleGoogleLogin = async () => {
    window.location.href = authService.getGoogleLoginUrl()
  }

  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string): boolean => {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setIsValidEmail(validateEmail(enteredEmail));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = e.target.value;
    setPassword(enteredPassword);
  };

  const onSubmit: SubmitHandler<User> = async (data) => {

    try {
      const formData = new FormData()
      if (!emailSubmitted) {
        // await authService.registerCheck(data.email);
        showSnackBar('輸入信箱成功', 'success')
        setEmailSubmitted(true)
      }
      else {
        // 輸入密碼後登入
        formData.append('username', data.email)
        formData.append('password', data.password as string)
        await login(formData)
        showSnackBar('登入成功', 'success')
        navigate('/')
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



  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // const handleEmailSubmit: SubmitHandler<User> = async (data) => {
  //   try {
  //     // Assuming `data` has the email
  //     const formData = new FormData();
  //     formData.append('username', data.email);
  //     // Here you can send the email to the server or check if it exists
  //     // For now, we'll just switch to the password form
  //     showSnackBar('輸入帳號成功', 'success')
  //     setEmailSubmitted(true);
  //   } catch (error) {
  //     showSnackBar('Failed to submit email:', 'error');
  //     // Handle errors appropriately
  //   }
  // }

  // const handlePasswordSubmit: SubmitHandler<User> = async (data) => {
  //   try {
  //     // Process password submission here
  //     const formData = new FormData();
  //     formData.append('password', data.password as string)
  //     // Navigate to next page or perform further actions
  //     await login(formData)
  //     showSnackBar('Login successful.', 'success')
  //     navigate('/')
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

  // const onSubmit: SubmitHandler<User> = async (data) => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('username', data.email)
  //     formData.append('password', data.password as string)
  //     await login(formData)
  //     showSnackBar('Login successful.', 'success')
  //     navigate('/')
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
      const formData = new FormData()
      if (!emailSubmitted) {
        // await authService.registerCheck(data.email);
        showSnackBar('輸入信箱成功', 'success')
        setEmailSubmitted(true)
      } 
      else {
        // 輸入密碼後登入
        formData.append('username', data.email)
        formData.append('password', data.password as string)
        await login(formData)
        showSnackBar('登入成功', 'success')
        navigate('/')
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
          {emailSubmitted ? '輸入密碼' : '登入'}
        </Typography>
      </ThemeProvider>

      {/* Box onSubmit={handleSubmit(onSubmit)} */}
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>

        {!emailSubmitted ? (
          <TextField
            margin='normal'
            required={false}
            label={email ? "" : "請輸入電子信箱"}
            // value={email}
            fullWidth
            id='email'
            // label='輸入電子信箱'
            autoComplete='email'
            autoFocus
            // error={!!errors.email}
            // helperText={errors.email && 'Please provide an email address.'}
            error={!isValidEmail && email !== ""}
            helperText={!isValidEmail && email !== "" ? "請輸入有效的電子信箱" : ""}
            InputLabelProps={{
              shrink: false,  // 讓標籤始終保持不動
            }}
            {...register('email', { required: true })}
            onChange={handleEmailChange}
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
          <TextField
            margin='normal'
            required={false}
            label={password ? "" : "請輸入密碼"}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            id='password'
            autoComplete='current-password'
            autoFocus
            error={!!errors.password}
            helperText={errors.password && 'Please provide a password.'}
            InputLabelProps={{
              shrink: false,  // 讓標籤始終保持不動
            }}
            {...register('password', { required: true })}
            onChange={handlePasswordChange}
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
          {emailSubmitted ? '登入' : '使用電子信箱繼續'}
        </Button>
        {emailSubmitted ? (
          <Grid container justifyContent='center'>
            <Grid item sx={{ margin: 1.75, fontFamily: 'Noto Sans TC' }}>
              <Link component={RouterLink} to='/setnewpwd' variant='body2' //將發送信做成snackbar並跳轉至設定密碼頁面
                onClick={() => showSnackBar("已將設定密碼連結寄送至 abcd@gmail.com", "success")}>
                {"忘記密碼？"}
              </Link>
            </Grid>
          </Grid>
        ) : (
          <Grid item></Grid>
        )}
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

      {/* <Collapse in={expanded} timeout='auto' unmountOnExit> */}
      {/* <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email address'
            autoComplete='email'
            autoFocus
            error={!!errors.email}
            helperText={errors.email && 'Please provide an email address.'}
            {...register('email', { required: true })}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            error={!!errors.password}
            helperText={errors.password && 'Please provide a password.'}
            {...register('password', { required: true })}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/register' variant='body2'>
                {"Don't have an account yet? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box> */}
      {/* </Collapse> */}
    </Box>
  )
}
