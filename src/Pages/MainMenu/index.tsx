import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

const MainMenu = () => {
  const navigation = useNavigate();
  return <>
    <h1>Main Menu</h1>

    <Button variant="contained" onClick={() => navigation('/game')}>Play web version</Button>
    <Button variant="contained" onClick={() => navigation('/download')}>Download App</Button>
    <Button variant="contained" onClick={() => navigation('/admin')}>Admin</Button>
  </>
}

export default MainMenu;