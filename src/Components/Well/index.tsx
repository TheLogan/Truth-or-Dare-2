import './style.scss'

interface iProps {
  children: React.ReactNode;
  variant: 'light' | 'dark';
}

const Well = (props: iProps) => {
  return <div className={`darkBackground ${props.variant}`}>
    {props.children}
  </div>
}

export default Well;