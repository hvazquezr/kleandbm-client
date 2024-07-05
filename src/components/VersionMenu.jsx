import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function VersionMenu({versionMenuOptions, onClose, onUpdateChangeName}){
    const open = Boolean(versionMenuOptions);
    console.log(versionMenuOptions);

    const handleRemoveName = useCallback(() => {
        onUpdateChangeName(versionMenuOptions.change.id, null);
        onClose();
    }, [versionMenuOptions]);

    return (
        <Menu
            open={open}
            anchorEl={versionMenuOptions?.anchorEl}
            onClose={onClose}
        >   
            <MenuItem >
                <ListItemIcon>
                    <SettingsBackupRestoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Restore this version</ListItemText>
            </MenuItem>
            <MenuItem >
                <ListItemIcon>
                    <DriveFileRenameOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
            </MenuItem>
            {versionMenuOptions.change.name &&
            <MenuItem onClick={handleRemoveName} >
                <ListItemIcon>
                    <FormatClearIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove name</ListItemText>
            </MenuItem>
            }
            <MenuItem >
                <ListItemIcon>
                    <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Make a copy</ListItemText>
            </MenuItem>
        </Menu>
    );
}
