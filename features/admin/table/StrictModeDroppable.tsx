import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

// Wrapper component to fix react-beautiful-dnd in React 18 StrictMode
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // This is a workaround for react-beautiful-dnd not working in StrictMode
    // We delay the enabling of the Droppable component until after the initial render
    const timeout = setTimeout(() => {
      setEnabled(true);
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
