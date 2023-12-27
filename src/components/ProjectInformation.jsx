import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SourceIcon from '@mui/icons-material/Source';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

function convertTimestampToReadable(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  

export default function ProjectInformation({
    projectDescription,
    onProjectDescriptionChange,
    onProjectDescriptionBlur,
    lastModified,
    projectCreatorName
    }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'center' }}>
        <Tooltip title="More">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, padding:0, marginLeft:0, opacity: 20 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon sx={{ width: 30, height: 30, color:'#DDD' }}/>
          </IconButton>
        </Tooltip>
      </Box>
      <Popover
        anchorEl={anchorEl}
        id="project-menu"
        open={open}
        onClose={handleClose}
        arrow="true"
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
            <Box p={1}>
            <Stack spacing={1} p={1} order='column' sx={{width:500, borderRadius:2, border: .5, borderColor: '#AAA'}} >
                <Typography variant="subtitle2">Description:</Typography>
                <TextField
                    sx={{
                    width: '100%',
                    "& .MuiOutlinedInput-root": {
                        "& > fieldset": {
                        borderColor: "#ffffff"
                        }
                    },              
                    "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                        border: "0.5px solid #AAAAAA",
                        }
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                        border: "0.5px solid #AAAAAA",
                        }
                    }
                    }}
                    inputProps={{style: {color:"#000000"}}} 
                    variant="outlined"
                    multiline
                    value={projectDescription}
                    onChange = {onProjectDescriptionChange}
                    onBlur={onProjectDescriptionBlur}
                />
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <Typography variant="subtitle2">Created By:</Typography>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>{projectCreatorName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <Typography variant="subtitle2">Last Modified:</Typography>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>{convertTimestampToReadable(lastModified)}</Typography>
                </Box>      
            </Stack>
            </Box>
            <Divider /> 
            <MenuItem>
                    <ListItemIcon>
                        <SourceIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Generate SQL Code</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <PhotoCameraIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download Image</ListItemText>
                </MenuItem>   
        </Popover>
    </React.Fragment>
  );
}
