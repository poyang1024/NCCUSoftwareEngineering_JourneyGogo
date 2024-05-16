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
      <SearchBar/>
      <AttractionCard/>
    </main>
  )
}
