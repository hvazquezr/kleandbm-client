import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete'


export default function RelationshipContextMenu({onClick, menuOptions, onDeleteRelationship}){

    const handleDelete = useCallback(() => {
        onDeleteRelationship(menuOptions.id);
    }, [menuOptions]);

    return (
        <Menu
            open={true}
            anchorReference="anchorPosition"
            anchorPosition={{top: menuOptions.top, left: menuOptions.left}}
            onClick={onClick} 
        >
            <MenuItem onClick={handleDelete} >
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
            </MenuItem>
        </Menu>
    );
}