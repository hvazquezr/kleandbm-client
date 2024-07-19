import React, { useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, ListItemText } from '@mui/material';

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useSnackbar } from 'notistack';



export default function VersionMenu({versionMenuOptions, onClose, onUpdateChangeName, onMakeACopy, restore}){
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [openVersionName, setOpenVersionName] = React.useState(false);
    const [versionName, setVersionName] = React.useState(null);
    const [changeNameError, setChangeNameError] = React.useState("");

    React.useEffect(() => {
        setVersionName(versionMenuOptions.change.name || "");
      }, [versionMenuOptions]);

    const handleRename = useCallback(() => {
        //setVersionName(versionMenuOptions.change.name || "");
        setOpenVersionName(true);
    }, [versionMenuOptions]);

    const handleMakeACopy = () => {
        onMakeACopy(versionMenuOptions.change.id);
        onClose();
    }

    const handleRestore = () => {
        restore(versionMenuOptions.change.id);
        onClose();
    }

    const handleRenameSubmit = () => {
        closeSnackbar();
        let error = ""
        if (!versionName) {
            error = 'Version name is required.'
            enqueueSnackbar(error, {variant: 'error'});  
            setChangeNameError(error);
            return;
        }
        setChangeNameError("");
        onUpdateChangeName(versionMenuOptions.change.id, versionName);
        onClose();
    };

    const handleRemoveName = useCallback(() => {
        onUpdateChangeName(versionMenuOptions.change.id, null);
        onClose();
    }, [versionMenuOptions]);

    return (
        <React.Fragment>
            <Menu
                open={true}
                anchorEl={versionMenuOptions?.anchorEl}
                onClose={onClose}
            >   
                <MenuItem onClick={handleRestore}>
                    <ListItemIcon>
                        <SettingsBackupRestoreIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Restore this version</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleRename} >
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
                <MenuItem onClick={handleMakeACopy}>
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Make a copy</ListItemText>
                </MenuItem>
            </Menu>
            <Dialog
                open={openVersionName}
            >
                <DialogContent>
                <DialogContentText>
                    Assign a name to this version to easily identify it.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="versionName2"
                    label="Version Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={versionName} // Set the value of the TextField
                    onChange={(e) => setVersionName(e.target.value)} 
                    error={changeNameError !== ""}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {setOpenVersionName(false); onClose();}}>Cancel</Button>
                <Button variant="contained" onClick={handleRenameSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
