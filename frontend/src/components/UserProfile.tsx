import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import { styled } from '@mui/system'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { useSnackBar } from '../contexts/snackbar'
import userService from '../services/user.service'
// import { Link } from 'react-router-dom';
import { User } from '../models/user'
import { AxiosError } from 'axios'

interface UserProfileProps {
  userProfile: User
  routeHandler: (url: string) => void
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

  useEffect(() => {
    reset(userProfile)
  }, [userProfile])

  const onSubmit: SubmitHandler<User> = async (data) => {
    let updatedUser: User
    try {
      if (currentUser?.uuid === userProfile.uuid) {
        // Updating user profile.
        updatedUser = await userService.updateProfile(data)
        setUser(updatedUser)
        showSnackBar('User profile updated successfully.', 'success')
      } else {
        // Updating user different from current user.
        updatedUser = await userService.updateUser(userProfile.uuid, data)
        showSnackBar('User profile updated successfully.', 'success')
      }
      if (onUserUpdated) {
        onUserUpdated(updatedUser)
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
  }

  const handleDeleteProfile = async () => {
    setOpen(true)
  }

  const handleCancel = () => setOpen(false)

  const handleConfirm = async () => {
    setOpen(false)
    await userService.deleteSelf()
    showSnackBar('You account has been deleted.', 'success')
    logout()
    navigate('/')
  }

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
          onSubmit={handleSubmit(onSubmit)}
          key={userProfile.uuid}
          noValidate
          data-testid='user-profile-form'
        >
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="standard-read-only-input"
                label="ID"
                defaultValue={userProfile.id}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id='name'
                label='帳戶名稱'
                variant="standard"
                defaultValue="王小明"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" >
                        <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id='email'
                label='電子郵件'
                defaultValue={userProfile.email}
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => props.routeHandler("/change-email")} >
                        <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
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
                <CustomTextField
                  fullWidth
                  label='Password'
                  type='password'
                  id='password'
                  variant="standard"
                  defaultValue="1111111111"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" >
                          <EditOutlinedIcon sx={{ color: "#ACB1C6" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

          </Grid>
          {/* <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Update
          </Button> */}
          <Button
            fullWidth
            variant='contained'
            sx={{
              mt: 4,
              fontSize: 15,
              fontWeight: "bold",
              backgroundColor: "#FF2B2B",
              "&:hover": {
                backgroundColor: "#FF5353",
              },
            }}
          // onClick={handleDeleteProfile}
          >
            刪除帳號
          </Button>
        </Box>
      </Box>
      {/* <Dialog
        open={open}
        onClose={handleCancel}
        aria-describedby='alert-profile-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-profile-dialog-description'>
            Are you sure you want to delete your account ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant='contained' color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  )
}


const CustomTextField = styled(TextField)`
  font-size: 15;
  font-weight: 500;
  padding-top: 8px
`;
