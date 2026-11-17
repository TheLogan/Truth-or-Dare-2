import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigation = useNavigate();
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', px: 2, py: 4, minWidth: 260 }}>
      <h1 style={{ paddingLeft: 0 }}>Main Menu</h1>
      <Button variant="contained" fullWidth onClick={() => navigation('/game')}>Play web version</Button>
      <Button variant="contained" fullWidth onClick={() => navigation('/download')}>Download App</Button>
      <Button variant="contained" fullWidth onClick={() => navigation('/admin')}>Admin</Button>
    </Stack>
  );
}

export default MainMenu;
