import React, { useCallback } from 'react';
import {useReactFlow} from 'reactflow';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';
import UndoIcon from '@mui/icons-material/Undo';


export default function PaneContextMenu({onClick, menuOptions, onAddTable, onAddTableWithAI, onAddNote, undo, undoStack}){
    const {project } = useReactFlow();

    const handleAddTable = useCallback(() => {
        onAddTable(project({x:menuOptions.left-menuOptions.pane.x, y:menuOptions.top-menuOptions.pane.y}));
    }, [menuOptions]);

    const handleAddTableWithAI = useCallback(() => {
        onAddTableWithAI(project({x:menuOptions.left-menuOptions.pane.x, y:menuOptions.top-menuOptions.pane.y}));
        //onAddTableWithAI(menuOptions.id);
    }, [menuOptions]);

    const handleAddNote = useCallback(() => {
        onAddNote(menuOptions.id);
    }, [menuOptions]);

    return (
        <Menu
            open={true}
            anchorReference="anchorPosition"
            anchorPosition={{top: menuOptions.top, left: menuOptions.left}}
            onClick={onClick} 
        >
            <MenuItem onClick={handleAddTable} >
                <ListItemIcon>
                    <TableChartOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Table</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddTableWithAI} >
                <ListItemIcon>
                    <PsychologyIcon fontSize="small" color="secondary"/>
                </ListItemIcon>
                <ListItemText>Add Table with AI</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddNote} >
                <ListItemIcon>
                    <StickyNote2OutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Note</ListItemText>
            </MenuItem>
            <MenuItem onClick={undo} disabled={undoStack.length == 0}>
                <ListItemIcon>
                    <UndoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Undo</ListItemText>
            </MenuItem>             
        </Menu>
    );
}
