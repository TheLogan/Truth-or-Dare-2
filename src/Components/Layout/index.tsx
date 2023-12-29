import { Grid } from '@mui/material';
import { ReactNode } from 'react';
import './style.scss';

interface LayoutProps {
  children: ReactNode;
}


const Layout = (props: LayoutProps) => {
  return <Grid container className="background" justifyContent="center" alignContent="center" style={{width: '100vw'}}>
    <Grid item >
      {props.children}
    </Grid>
  </Grid>
}

export default Layout;