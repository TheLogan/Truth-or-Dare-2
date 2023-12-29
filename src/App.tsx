import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './Components/Layout';
import MainMenu from './Pages/MainMenu';
import 'typeface-roboto'
// import { useActions } from './Overmind';
// import Admin from './Pages/Admin';
import Game from './Pages/Game';
import { Button } from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import './baseStyle.scss';
import { supabase } from './Components/Supabase';
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { cardsAtom } from "./Jotai/Game";
function App() {
  
  const setCards = useSetAtom(cardsAtom);
  useEffect(() => {
    fetchCards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCards = async () => {
    const { data: cards, error } = await supabase.from('cards').select('*');
    if (error) console.log('error', error);
    else setCards(cards);
    console.log('cards', cards)
  };


  //Routing on individual pages/subroutes
  return (
    <Router>
      <Routes>
        <Route path="/game/*" element={<Game />} />
        <Route path="/download" element={
          <Layout>
            <h3>Downloads</h3>
            <Button variant="contained" onClick={() => document.location.href = "https://drive.google.com/u/0/uc?export=download&confirm=KeQY&id=1Gpk5VfrgzZznF49S9rke4syIX3N_CGFB"} >
              <AndroidIcon style={{ paddingRight: '10px' }} />
              Android
            </Button>
          </Layout>
        } />
        <Route path="/" element={
          <Layout>
            <MainMenu />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
