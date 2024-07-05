import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'


export default function VersionMenu({anchorEl, onClick, menuOptions, onEditTable, onDeleteTable}){
    const open = Boolean(anchorEl);

    return (
        <Menu
            open={open}
            anchorEl={anchorEl}
            onClick={onClick} 
        >   
            <MenuItem >
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Restore</ListItemText>
            </MenuItem>
            <MenuItem >
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
            </MenuItem>
        </Menu>
    );
}
