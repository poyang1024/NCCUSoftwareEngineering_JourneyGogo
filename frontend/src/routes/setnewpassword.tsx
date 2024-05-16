import { Grid, Container, Paper, Box } from '@mui/material'
import ForgetPassword from '../components/ForgetPassword'
import { useParams } from 'react-router-dom'


const SetPassword = () => {

  const { id, token } = useParams()

  return (
    // 使用全螢幕的 Box 作為最外層容器
    <Box sx={{
      height: '80vh', // 整個視窗高度
      display: 'flex', // 啟用 Flexbox
      alignItems: 'center', // 垂直居中
      justifyContent: 'center' // 水平居中
    }}>
      <Container maxWidth='lg'>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={12} md={7} lg={5}>
            <Paper
              elevation={4} // 陰影
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px', // 圓邊角
                // 確保 Paper 的寬度不受 Grid container 限制
                width: '100%',
                //maxWidth: 400 // 或者你想要的最大寬度
              }}
            >
              {id && token && <ForgetPassword id={id} token={token} />}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default SetPassword