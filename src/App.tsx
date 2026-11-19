import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from './Components/Layout';
import MainMenu from './Pages/MainMenu';
import 'typeface-roboto'
// import { useActions } from './Overmind';
import Admin from './Pages/Admin';
import Game from './Pages/Game';
import { Button } from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import './baseStyle.scss';
import { supabase } from './Components/Supabase';
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { cardsAtom } from "./Jotai/Game";
import type { tCard } from "./types";
function App() {
  
  const setCards = useSetAtom(cardsAtom);
  useEffect(() => {
    const fetchCards = async () => {
      const { data: cards, error } = await supabase.from('cards').select('*');
      if (error) console.log('error', error);
      else setCards(cards as tCard[]);
      console.log('cards', cards)
    };
    fetchCards().catch((e) => console.log('error', e));
  }, [setCards]);

  //Routing on individual pages/subroutes
  return (
    <HashRouter>
      <Routes>
        <Route path="/game/*" element={<Game />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/download" element={
          <Layout>
            <h3>Downloads</h3>
            <Button variant="contained" href="https://github.com/TheLogan/Truth-or-Dare-2/releases/latest/download/truth-or-dare.apk">
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
    </HashRouter>
  );
}

export default App;
