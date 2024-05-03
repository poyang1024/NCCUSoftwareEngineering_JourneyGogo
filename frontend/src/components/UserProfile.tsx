import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { useSnackBar } from '../contexts/snackbar'
import userService from '../services/user.service'
import { User } from '../models/user'
import { AxiosError } from 'axios'
import CustomTextField from './UI/CustomTextField';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ProfileRouteProps from '../interface/ProfileRouteProps';
import CustomActionBtn from './UI/CustomActionBtn';

interface UserProfileProps extends ProfileRouteProps {
  userProfile: User,
  onUserUpdated?: (user: User) => void
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile, onUserUpdated } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: userProfile,
  })
  const navigate = useNavigate()
  const { user: currentUser, setUser, logout } = useAuth()
  const { showSnackBar } = useSnackBar()
  const [open, setOpen] = useState(false)

  // for Dialog password field
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPwd = e.target.value;
    setPassword(enteredPwd);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (open === true) {
      setPassword("")
    }
    // reset(userProfile)
  }, [open])

  // const onSubmit: SubmitHandler<User> = async (data) => {
  //   let updatedUser: User
  //   try {
  //     if (currentUser?.uuid === userProfile.uuid) {
  //       // Updating user profile.
  //       updatedUser = await userService.updateProfile(data)
  //       setUser(updatedUser)
  //       showSnackBar('User profile updated successfully.', 'success')
  //     } else {
  //       // Updating user different from current user.
  //       updatedUser = await userService.updateUser(userProfile.uuid, data)
  //       showSnackBar('User profile updated successfully.', 'success')
  //     }
  //     if (onUserUpdated) {
  //       onUserUpdated(updatedUser)
  //     }
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

  const handleDeleteProfile = async () => {
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    handleCancel()
    // await userService.deleteSelf()
    const isCorrect = (password === "12345@Abcde")
    if (isCorrect) {
      showSnackBar('You account has been deleted.', 'success')
      logout()
      navigate('/')
    }
    else {
      showSnackBar('Wrong password.', 'error')
    }
  }
  console.log(userProfile)

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Box
          component='form'
          // onSubmit={handleSubmit(onSubmit)}
          key={userProfile.uuid}
          noValidate
          data-testid='user-profile-form'
        >
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='name'
                label='帳戶名稱'
                variant="standard"
                defaultValue={userProfile.first_name || userProfile.last_name ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}` : "尚未設定"}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => props.routeHandler("/change-name")} >
                        <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  fontSize: "15px",
                  fontWeight: 500,
                  paddingTop: "8px"
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='電子郵件'
                defaultValue={userProfile.email}
                variant="standard"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => props.routeHandler("/change-email")} >
                        <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  fontSize: "15px",
                  fontWeight: 500,
                  paddingTop: "8px"
                }}

              />
            </Grid>

            {/* if use google map account */}
            {/* {userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Connected with'
                  id='provider'
                  disabled={true}
                  variant='standard'
                  InputProps={{
                    startAdornment: <GoogleIcon sx={{ mr: 1 }} />,
                  }}
                  {...register('provider')}
                />
              </Grid>
            )} */}

            {/* if not use google map account */}
            {!userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='密碼'
                  type='password'
                  id='password'
                  variant="standard"
                  defaultValue="1111111111"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => props.routeHandler("/enter-old-pwd")}>
                          <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                    paddingTop: "8px"
                  }}
                />
              </Grid>
            )}

          </Grid>
          {/* <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Update
          </Button> */}
          <CustomActionBtn
            fullWidth
            sx={{
              mt: 4,
              backgroundColor: "#FF2B2B",
            }}
            hoverBackgroundColor='#FF5353'
            onClick={handleDeleteProfile}
          >
            刪除帳號
          </CustomActionBtn>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-describedby='alert-profile-dialog-description'
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle id='alert-dialog-title'>
          <p style={{ fontSize: "20px", fontWeight: 500, color: "#000000" }}>刪除帳號</p>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#000000" }}>刪除帳號將會遺失所有資料，是否確定刪除？</p>
        </DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            label={password ? "" : "請輸入密碼"}
            value={password}
            onChange={handlePwdChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ paddingLeft: "24px", paddingRight: "24px", paddingBottom: "20px", display: 'flex', justifyContent: 'space-between', gap: "1rem" }} >
          <CustomActionBtn
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#FF2B2B",
              flex: 1,
              flexGrow: 1,
            }}
            hoverBackgroundColor='#FF5353'
          >
            確認刪除
          </CustomActionBtn>
          <CustomActionBtn
            onClick={handleCancel}
            sx={{
              backgroundColor: "#808080",
              flex: 1,
              flexGrow: 1,
            }}
            hoverBackgroundColor='#B0B0B0'
          >
            取消
          </CustomActionBtn>
        </DialogActions>
      </Dialog>
    </div>
  )
}

