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
    // formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()

  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState({
    "first": "",
    "second": ""
  })
  const [name, setName] = useState("")
  const [isValidName, setIsValidName] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(false);

  const [isValidPwd, setValidPwd] = useState({ // first field and scoond field
    "first": false,
    "second": false
  });

  const validateEmail = (email: string): boolean => {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  } ;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setIsValidEmail(validateEmail(enteredEmail));
  };

  const handlePwdChange_first = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPwd = e.target.value;
    setPassword({
        ...password,
        first: enteredPwd
    });
    setValidPwd({
        ...isValidPwd,
        first: validatePassword(enteredPwd)
    });
  };

  const handlePwdChange_second = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPwd = e.target.value;
    setPassword({
        ...password,
        second: enteredPwd
    });
    setValidPwd({
        ...isValidPwd,
        second: enteredPwd === password.first
    });
  };

  const validatePassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
    return passwordPattern.test(password);
  };

  const validateName = (name: string): boolean => {
    if (name.length >= 6 && name.length <= 20){
      return true
    }
    else{
      return false
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredName = e.target.value;
      setName(enteredName);
      setIsValidName(validateName(enteredName));
  };

  const onSubmit: SubmitHandler<User> = async (data) => {

    try {
      if (!emailSubmitted) {
      const checkResult = await authService.checkEmail(data.email);
      if (checkResult.is_registered) {
        showSnackBar('此電子郵件已註冊，請直接登入', 'error');
        setTimeout(() => navigate('/login'), 2000, { replace: true }); //延遲 2 秒後跳轉到登入頁面
      } else {
        showSnackBar('輸入信箱成功，請繼續填寫其餘資訊', 'success');
        setEmailSubmitted(true);
      }
    } else {
      await authService.register(data);
      showSnackBar('建立帳號成功', 'success');
      navigate('/login');
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
      }}
    >
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
            label={email ? "" : "請輸入電子信箱"}
            autoComplete='email'
            autoFocus
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
              label={name ? "" : "請輸入帳戶名稱"}
              error={!isValidName && name !== ""}
              helperText={!isValidName && name !== "" ? "請輸入有效的帳戶名稱" : ""}
              InputLabelProps={{
                shrink: false,  // 讓標籤始終保持不動
              }}
              {...register('first_name')}
              onChange={handleNameChange}
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
                <Typography variant='subtitle1' gutterBottom sx={{ mt: 1, color: 'text.secondary', fontFamily: 'Noto Sans TC' }}>
                需至少使用 10 個字元，包含大寫、小寫字母以及數字。
              </Typography>
              </ThemeProvider>
            </Box>
            <TextField
              margin='normal'
              required={false}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              id='password'
              label={password.first ? "" : "請輸入密碼"}
              // autoComplete='new-password'
              error={!isValidPwd.first && password.first !== ""}
              helperText={!isValidPwd.first && password.first !== "" ? "請輸入有效的密碼" : ""}
              InputLabelProps={{
                shrink: false,  // 讓標籤始終保持不動
              }}
              onChange={handlePwdChange_first}
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
              label={password.second ? "" : "請再次輸入密碼"}
              //autoComplete='new-password'
              error={!isValidPwd.second && password.second !== ""}
              helperText={!isValidPwd.second && password.second !== "" ? "請輸入相同的密碼" : ""}
              InputLabelProps={{
                shrink: false,  // 讓標籤始終保持不動
              }}
              {...register('password', { required: true })}
              onChange={handlePwdChange_second}
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
        <Button type='submit' fullWidth variant='contained'
        disabled={(isValidEmail == false) || ((emailSubmitted == true) && (password.first !== password.second || password.first === '' || isValidName == false))}    
        sx={{
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
            fontFamily: 'Noto Sans TC',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: '6px',
          }
        }}
        >
          {/* onClick={handleExpandClick}> */}
          {emailSubmitted ? '建立帳戶' : '使用電子信箱繼續'}
        </Button>
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
    </Box>
  )
}
