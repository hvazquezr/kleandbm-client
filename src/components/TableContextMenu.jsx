import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function TableContextMenu({
    id,
    top,
    left,
    ...props
}) {

  return (
    <Menu
        open={true}
        anchorReference="anchorPosition"
        anchorPosition={{top: top, left:left}}
    >
        <MenuItem onClick={() => {alert('Editing')}}>Edit</MenuItem>
        <MenuItem onClick={() => {alert('Deleting')}}>Delete</MenuItem>
    </Menu>
  );
}
