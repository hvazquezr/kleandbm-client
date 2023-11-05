import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function TableContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={alert('Editing')}>Edit</button>
      <button onClick={alert('Deleting')}>Delete</button>
    </div>
  );
}
