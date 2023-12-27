import * as React from 'react';

import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';

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

  
  const imageWidth = 2048; //(1024*2)
  const imageHeight = 1536; //(768*2)

  function createProjectInfoTable(x, y,  projectName, projectDescription, projectCreatorName, lastModified) {
    // Create a new div element
    const newDiv = document.createElement('div');
  
    // Set the position style of the div
    newDiv.style.position = 'absolute';
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y}px`;
    newDiv.style.width = '450px'
  
    // Create a new table element
    const table = document.createElement('table');
    table.innerHTML = `
    <table id="infoTable">
      <tr>
        <th>Name</th>
        <td>${projectName}</td>
      </tr>
      <tr>
          <th>Description</th>
          <td>${projectDescription}</td>
      </tr>
      <tr>
          <th>Created by</th>
          <td>${projectCreatorName}</td>
      </tr>
      <tr>
          <th>Last Modified</th>
          <td>${lastModified}</td>
      </tr>
    </table>
    `; // Adjust table HTML as needed
  
    // Append the table to the div
    table.id='infoTable';
    newDiv.appendChild(table);
  
    return newDiv;
  }
  

export default function ProjectInformation({
    projectName,
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

  const { getNodes } = useReactFlow();

  const onDownloadClick = () => {

    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library

    function downloadImage(dataUrl) {
      const a = document.createElement('a');
      a.setAttribute('download', `${projectName}.png`);
      a.setAttribute('href', dataUrl);
      a.click();
      content.removeChild(infoTable);
      content.removeChild(imageDiv);
    }

    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.2, 3, .02);
    const content = document.querySelector('.react-flow__viewport'); // The content you want to capture

    const tableXPosition = nodesBounds.width>imageWidth?nodesBounds.x:(nodesBounds.x-(imageWidth/transform[2]-nodesBounds.width)/2);
    const tableYPosition = nodesBounds.height>imageHeight?nodesBounds.y:(nodesBounds.y-(imageHeight/transform[2]-nodesBounds.height)/2);

    const imageXPosition = (nodesBounds.width>imageWidth?nodesBounds.x+nodesBounds.width:nodesBounds.x+imageWidth) - 15 - 150;
    const imageYPosition = (nodesBounds.height>imageWidth?nodesBounds.y+nodesBounds.height:nodesBounds.x+imageHeight) - 15 - 24;

    const infoTable = createProjectInfoTable(tableXPosition+15, tableYPosition+15, projectName, projectDescription, projectCreatorName, convertTimestampToReadable(lastModified));
    content.appendChild(infoTable);

    // Addiing footer image
    const imageDiv = document.createElement('div');
    imageDiv.innerHTML = '<img src="/images/bluelogo.png" width="150" height="24"/>';

    imageDiv.style.position = 'absolute';
    imageDiv.style.left = `${imageXPosition}px`;
    imageDiv.style.top = `${imageYPosition}px`;
    content.appendChild(imageDiv);
    //newDiv.style.width = '450px'
    

    toPng(content, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);

    handleClose();
  };

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
                <MenuItem onClick={onDownloadClick}>
                    <ListItemIcon>
                        <PhotoCameraIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download Image</ListItemText>
                </MenuItem>   
        </Popover>
    </React.Fragment>
  );
}
