import { Container, Grid, Button, Stack, Box } from '@mui/material'
import { styled } from '@mui/system'
import UserProfile from '../components/UserProfile'
import Setting from '../components/Pages/Setting'
import { useAuth } from '../contexts/auth'
import CustomCard from '../components/UI/CustomCard'
import React, { useState } from 'react'

interface profileProps {
  Routes: string
}

export function Profile({ Routes }: profileProps) {

  const { user } = useAuth()
  const [active, isActive] = useState(true)
  const buttonClickHandler = () => {
    isActive(!active)
  }
  const renderRoute: (route: string) => React.ReactNode = (route) => {
    if (user) {
      if (route === "/") {
        return <UserProfile userProfile={user} />
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
                <CustomBtn $active={active} onClick={buttonClickHandler}>
                  個人資料
                </CustomBtn>
                <CustomBtn $active={!active} onClick={buttonClickHandler}>
                  設定
                </CustomBtn>
              </Stack>
            </Box>
            <Box sx={{ width: '80%' }}>
              {active ? (renderRoute(Routes)) : (
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
  cursor: ${p => p.$active ? "default" : "pointer"};
  pointer-events: ${p => p.$active ? "none" : "auto"};
`;