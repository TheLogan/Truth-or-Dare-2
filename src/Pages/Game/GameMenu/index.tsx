import { Button, Stack } from "@mui/material";
import { ArrowRight } from '@mui/icons-material'
import { useNavigate } from "react-router-dom";
import './style.scss';

const GameMenu = () => {
  const navigation = useNavigate();



  return <>
    <Stack
      direction="column"
      className="gameMenu"
      spacing={0}
      sx={{ height: "100%", py: 2, justifyContent: "flex-start", alignItems: "center" }}
    >
      <Stack direction="column" spacing={16} sx={{ mb: 3, alignItems: "center" }}>
        <div>
          <h1>Logans</h1>
          <div className="bg">
            <span className="blue">Truth</span>
            <span className="gold">or</span>
            <span className="pink">Dare</span>
          </div>
        </div>
        <Button variant="contained" onClick={() => navigation('/game/setup')} id="playBtn">
          <ArrowRight className="arrow" />
        </Button>
        <Button variant="contained" id="creditsBtn">Credits</Button>
      </Stack>
    </Stack>
  </>
}

export default GameMenu;