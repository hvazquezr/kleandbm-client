import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export default function TableContextMenu({onClick,
    id,
    top,
    left,
    ...props
})
{

    const editNode = useCallback(() => {
        alert('Editing');
    }, [id]);

    return (
        <Menu
            open={true}
            anchorReference="anchorPosition"
            anchorPosition={{top: top, left:left}}
            onClick={onClick} 
        >
            <MenuItem onClick={editNode} disableRipple>
                Edit
            </MenuItem>
            <MenuItem onClick={editNode} disableRipple>
                Delete
            </MenuItem>
        </Menu>
    );
}
