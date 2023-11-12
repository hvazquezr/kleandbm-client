import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'


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
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} disableRipple>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
            </MenuItem>
        </Menu>
    );
}
