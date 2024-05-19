import { Container, Grid, Button, Stack, Box } from '@mui/material'
import { styled } from '@mui/system'
import UserProfile from '../components/UserProfile'
import ChangeEmailUrl from '../components/Profile/ChangeEmailUrl'
import ChangeEmail from '../components/Profile/ChangeEmail'
import Setting from '../components/Profile/Setting'
import { useAuth } from '../contexts/auth'
import { useNavigate } from 'react-router-dom'
import CustomCard from '../components/UI/CustomCard'
import React, { useState, useEffect } from 'react'
import ChangeEmailVerify from '../components/Profile/ChangedEmailVerify'
import EnterOldPwd from '../components/Profile/EnterOldPwd'
import ChangePwd from '../components/Profile/ChangePwd'
import ChangeName from '../components/Profile/ChangeName'
import userService from '../services/user.service'
import { User } from '../models/user'
import { useSnackBar } from '../contexts/snackbar'
import { AxiosError } from 'axios'

type profileRoute = {
  [key: string]: React.ReactNode
}


export function Profile() {

  const { showSnackBar } = useSnackBar()
  // check the auth
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [])

  // control the internal routing of profile
  const [pRoute, setRoute] = useState<string>('/');
  const profileRouteHandler = (url: string) => {
    setRoute(url);
  };

  const [activeId, setActive] = useState(1)
  const buttonClickHandler = (buttonId: number, url: string): void => {
    profileRouteHandler(url)
    setActive(buttonId)
  };

  // handle user profile editing
  const submitHandler = async (input: object): Promise<void> => {
    let updatedUser: User
    const data: User = Object.assign({}, user, input);
    try {
      // Updating user profile.
      updatedUser = await userService.updateProfile(data)
      setUser(updatedUser)
      profileRouteHandler('/')
      showSnackBar('User profile updated successfully.', 'success')
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

  // internal route of profile
  const routes: profileRoute = {
    "/": user && <UserProfile userProfile={user} routeHandler={profileRouteHandler} />,
    "/change-email-url": <ChangeEmailUrl />,
    "/change-email": <ChangeEmail submitHandler={submitHandler} />,
    "/change-email-verify": <ChangeEmailVerify />,
    "/enter-old-pwd": <EnterOldPwd routeHandler={profileRouteHandler} />,
    "/change-password": <ChangePwd submitHandler={submitHandler} />,
    "/change-name": <ChangeName submitHandler={submitHandler} />
  };

  // render the right side of profile box depends on the url
  const renderRoute = (route: string): React.ReactNode => {
    if (user) {
      return routes[route]
    }
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={10} lg={10} >
          <CustomCard>
            <Box sx={{ width: '20%' }}>
              <Stack direction='column' gap='0.5rem'>
                <CustomBtn $active={activeId === 1} onClick={() => buttonClickHandler(1, "/")}>
                  個人資料
                </CustomBtn>
                <CustomBtn $active={activeId === 2} onClick={() => buttonClickHandler(2, "/")}>
                  設定
                </CustomBtn>
              </Stack>
            </Box>
            <Box sx={{ width: '65%' }}>
              {activeId === 1 ? (renderRoute(pRoute)) : (
                <Setting />
              )}
            </Box>
          </CustomCard>
        </Grid>
      </Grid>
    </Container>
  )
}

const CustomBtn = styled(Button, {
  shouldForwardProp: (props) => props !== "$active"
}) <{ $active: boolean }>`
  padding: 11px 0px 11px 15px ;
  justify-content: flex-start;
  font-size: 15;
  font-weight: 500;
  color: ${(p) => p.$active ? "#18CE79" : "#ACB1C6"};
  background-color: ${p => p.$active ? "rgba(24, 206, 121, 0.15)" : "transparent"};
  gap: 1rem;
  /* cursor: ${p => p.$active ? "default" : "pointer"};
  pointer-events: ${p => p.$active ? "none" : "auto"}; */
`;