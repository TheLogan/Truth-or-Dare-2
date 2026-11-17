import './style.scss'
import type { ReactNode } from "react";

interface iProps {
  children: ReactNode;
  variant: 'light' | 'dark';
  className?: string;
}

const Well = (props: iProps) => {
  return <div className={`darkBackground ${props.variant}${props.className ? ' ' + props.className : ''}`}>
    {props.children}
  </div>
}

export default Well;