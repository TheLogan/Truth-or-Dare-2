import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';
import './style.scss';

interface LayoutProps {
  children: ReactNode;
}


const Layout = (props: LayoutProps) => {
  return (
    <Stack
      className="background"
      sx={{ width: '100vw', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box>{props.children}</Box>
    </Stack>
  );
}

export default Layout;