import { useState, useRef } from 'react'
import {
    Box,
    //Avatar,
    //Divider,
    Typography,
    Button,
    TextField,
    //Link,
    Grid,
    //SvgIcon,
    //SvgIconProps,
    //Collapse,
    IconButton,
    InputAdornment,
} from '@mui/material'
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ThemeProvider } from '@mui/material/styles';
import { //Link as RouterLink,
    useNavigate
} from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSnackBar } from '../contexts/snackbar'
import authService from '../services/auth.service'
import { User } from '../models/user'
import { AxiosError } from 'axios'
import LoginandRegistertheme from '../LoginandRegistertheme.tsx'

type ForgetPasswordProps = {
    id: string,
    token: string
}

export default function ForgetPassword({ id, token }: ForgetPasswordProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>()
    const navigate = useNavigate()
    const { showSnackBar } = useSnackBar()


    const [pwdSubmitted, setPwdSubmitted] = useState(false);

    const onSubmit: SubmitHandler<User> = async (data) => {

        try {
            const formData = new FormData()
            formData.append('password', data.password as string)
            await authService.resetPassword({
                password: formData.get("password")
            }, id, token)
            showSnackBar('更改密碼成功', 'success')
            navigate('/')
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
            }}
        >
            <ThemeProvider theme={LoginandRegistertheme}>
                <Typography component='h1' variant='h5'>
                    {pwdSubmitted ? '登入' : '重新設定密碼'}
                </Typography>
            </ThemeProvider>

            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
                <Box>
                    <Box>
                        <Typography variant='subtitle1' gutterBottom sx={{ mt: 1, color: 'text.secondary', fontFamily: 'Noto Sans TC' }}>
                            需至少使用 10 個字元，包含大寫、小寫字母及數字。
                        </Typography>
                    </Box>
                    <Box>
                        <Grid item sx={{ marginTop: 1, }}></Grid>
                        <ThemeProvider theme={LoginandRegistertheme}>
                            <Typography component='h3' variant='h5'>
                                新密碼
                            </Typography>
                        </ThemeProvider>
                    </Box>
                    <TextField
                        margin='normal'
                        required={false}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='請輸入密碼'
                        error={!!errors.password}
                        helperText={errors.password && 'Please provide a password.'}
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
                        placeholder='請再次輸入密碼'
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
                        bgcolor: '#32E48E',
                        boxShadow: 'none',
                    },
                }}
                >
                    確認
                </Button>
            </Box>
        </Box>
    );
}    
