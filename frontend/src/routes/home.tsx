import {
  Grid,
  Container,
} from '@mui/material'
// import { useLoaderData } from 'react-router-dom'
import SearchBar from '../components/Home/SearchBar';
import AttractionCard from '../components/Home/AttractionCard';


export default function Home() {
  return (
    <main>
      <Container maxWidth='lg' sx={{ mt: 4, mb: 8 }}>
        <Grid container justifyContent='center'>
          <SearchBar />
        </Grid>
      </Container>
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <AttractionCard />
      </Container>
    </main>
  )
}
