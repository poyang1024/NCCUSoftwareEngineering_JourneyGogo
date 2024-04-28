import { Container, Grid, Button, Stack, Box } from '@mui/material'
import { styled } from '@mui/system'
import UserProfile from '../components/UserProfile'
import ChangeEmailUrl from './Profile/ChangeEmailUrl'
import ChangeEmail from './Profile/ChangeEmail'
import Setting from './Profile/Setting'
import { useAuth } from '../contexts/auth'
import CustomCard from '../components/UI/CustomCard'
import React, { useState } from 'react'
import ChangeEmailVerify from './Profile/ChangedEmailVerify'
import EnterOldPwd from './Profile/EnterOldPwd'
import ChangePwd from './Profile/ChangePwd'

interface profileProps {
  routeHandler: (url: string) => void
  pRoute: string
}

export function Profile({ routeHandler, pRoute }: profileProps) {

  const { user } = useAuth()
  const [activeId, setActive] = useState(1)
  const buttonClickHandler: (buttonId: number, url: string) => void = (buttonId, url) => {
    routeHandler(url)
    setActive(buttonId)
  }
  // render the right side of profile box depends on the url
  const renderRoute: (route: string) => React.ReactNode = (route) => {
    if (user) {
      if (route === "/") {
        return <UserProfile userProfile={user} routeHandler={routeHandler} />
      }
      else if (route === '/change-email-url') {
        return <ChangeEmailUrl />
      }
      else if (route === '/change-email') {
        return <ChangeEmail />
      }
      else if (route === '/change-email-verify') {
        return <ChangeEmailVerify />
      }
      else if (route === '/enter-old-pwd') {
        return <EnterOldPwd routeHandler={routeHandler} />
      }
      else if (route === '/change-password') {
        return <ChangePwd />
      }
    }
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={10} lg={10}>
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
            <Box sx={{ width: '80%' }}>
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