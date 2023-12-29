import { useLocation } from "react-router-dom";
import Layout from "../../Components/Layout";
import GameMenu from "./GameMenu";
import GameSetup from "./GameSetup";
import Play from "./Play";

const Game = () => {
  const location = useLocation();

  switch (location.pathname) {
    case '/game':
      return <Layout>{<GameMenu />}</Layout>;
    case '/game/setup':
      return <Layout>{<GameSetup />}</Layout>;
    case '/game/play':
      return <Layout>{<Play />}</Layout>;
  }
};

export default Game;