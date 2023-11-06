import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export default function TableContextMenu({onClick, menuOptions, onEditTable, onDeleteTable}){
    const handleEdit = useCallback(() => {
        onEditTable(menuOptions.id);
    }, [menuOptions]);

    const handleDelete = useCallback(() => {
        onDeleteTable(menuOptions.id);
    }, [menuOptions]);

    return (
        <Menu
            open={true}
            anchorReference="anchorPosition"
            anchorPosition={{top: menuOptions.top, left: menuOptions.left}}
            onClick={onClick} 
        >
            <MenuItem onClick={handleEdit} disableRipple>
                Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} disableRipple>
                Delete
            </MenuItem>
        </Menu>
    );
}
