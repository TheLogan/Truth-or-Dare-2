import React, { CSSProperties, useEffect, useState } from "react";
import { iBoop } from "./interfaces";

const Boop: React.FC<iBoop> = (props) => {
  const [isBooped, setIsBooped] = useState(false);

  const style: CSSProperties = {
    display: 'inline-block',
    backfaceVisibility: 'hidden',
    transform: isBooped ?
      `rotate(${props.rotation}deg)` :
      `rotate(0deg)`,
    transition: `transform ${props.timing}ms`,
    width: '100%'
  }

  useEffect(() => {
    if (!isBooped) return;
    const timeoutId = window.setTimeout(
      () => { setIsBooped(false) },
      props.timing
    );
    return () => {
      window.clearTimeout(timeoutId);
    }
  }, [isBooped, props.timing])

  const trigger = () => {
    setIsBooped(true);
  }

  return (
    <span onMouseEnter={trigger} style={style}>
      {props.children}
    </span>
  )
}

export default Boop;