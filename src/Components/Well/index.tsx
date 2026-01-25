import './style.scss'
import type { ReactNode } from "react";

interface iProps {
  children: ReactNode;
  variant: 'light' | 'dark';
}

const Well = (props: iProps) => {
  return <div className={`darkBackground ${props.variant}`}>
    {props.children}
  </div>
}

export default Well;