import React, { useState } from "react";
import Dragger, { DraggableData } from "react-draggable";
import { Vector2 } from "../utils/types";
import { iDraggable } from "./interfaces";

interface iProps extends iDraggable {
  children: React.ReactNode
}

const Draggable = (props: iProps) => {
  const [dragPos, setDragPos] = useState<null | Vector2>(null)
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = React.useRef(null);

  const style: React.CSSProperties = {
    transition: isDragging === false ? 'transform 0.3s' : undefined
  }

  const handleDrag = (d: DraggableData) => setDragPos(new Vector2({ x: d.x, y: d.y }));
  const onStart = () => setIsDragging(true);
  const onStop = () => {
    setIsDragging(false);
    if (dragPos && (Math.abs(dragPos.x) > 120 || Math.abs(dragPos.y) > 280)) {
      setDragPos({ x: dragPos.x * 3, y: dragPos.y * 3 });
      props.cardExit();
      return;
    }

    setDragPos({ x: 0, y: 0 });
  }

  return <Dragger position={dragPos || undefined} onStart={onStart} onStop={onStop} onDrag={(_e, d) => handleDrag(d)} nodeRef={nodeRef} >
    <div style={style} ref={nodeRef}>
      {props.children}
    </div>
  </Dragger>
}

export default Draggable;