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
import HistoryIcon from '@mui/icons-material/History';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import { TextField , Avatar} from '@mui/material';
import { useSnackbar } from 'notistack';

import SQLCodeDisplay from './SQLCodeDisplay';
import NamingRulesEditor from './NamingRulesEditor';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { lookupDbTechnology } from './utils';

const headerStyle = {fontWeight:'bold', fontFamily:'sans-serif', color:'text.primary'};
const labelStyle = {color:'text.secondary'};

function toLocalTime(isoDate) {
  const localDate = new Date(isoDate + 'Z');

  const formattedDate = localDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  });
  
  const formattedTime = localDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Set to true if you want 12-hour format with AM/PM
  });
  
  return `${formattedDate} ${formattedTime}`;
}
  

  function createProjectInfoTable(x, y,  projectName, projectDescription, projectCreatorName, lastChange, countTables, countColumns, countRels) {
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
        <td colspan="2">${projectName}</td>
      </tr>
      <tr>
          <th>Description</th>
          <td colspan="2">${projectDescription}</td>
      </tr>
      <tr>
          <th>Created by</th>
          <td colspan="2">${projectCreatorName}</td>
      </tr>
      <tr>
          <th>Last Modified</th>
          <td colspan="2">${lastChange.timestamp}</td>
      </tr>
      <tr>
        <td width="33%"><b>Tables:</b>&nbsp;${countTables}</td>
        <td width="33%"><b>Columns:</b>&nbsp;${countColumns}</td>
        <td width="33%"><b>Relationships:</b>&nbsp;${countRels}</td>
      </tr>      
    </table>
    `; // Adjust table HTML as needed
  
    // Append the table to the div
    table.id='infoTable';
    newDiv.appendChild(table);
  
    return newDiv;
  }

  // Function to get the total count of all columns
  const totalCountOfColumns = (array) => {
    return array.reduce((accumulator, element) => {
      if (element.data && Array.isArray(element.data.columns)) {
        return accumulator + element.data.columns.length;
      }
      return accumulator;
    }, 0); // Start with an initial count of 0
  };
  

export default function ProjectInformation({
    projectId,
    projectName,
    projectDescription,
    onProjectDescriptionChange,
    onProjectDescriptionBlur,
    onProjectNameChange,
    onProjectNameBlur,
    lastChange,
    projectCreatorName,
    dbTechnology,
    onSubmitChangeName
    }) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSqlWindow, setOpenSqlWindow] = React.useState(false);
  const [openNamingRules, setOpenNamigRules] = React.useState(false);
  const [openVersionName, setOpenVersionName] = React.useState(false);
  const [changeName, setChangeName] = React.useState(lastChange.name || "");
  const [changeNameError, setChangeNameError] = React.useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { getNodes, getEdges } = useReactFlow();
  const countTables = getNodes().filter(node => node.type === 'tableNode').length;
  const countColumns = totalCountOfColumns(getNodes());
  const countRels = getEdges().length;

  const handleDialogSubmit = () => {
    closeSnackbar();
    let error = ""
    if (!changeName) {
      error = 'Version name is required.'
      enqueueSnackbar(error, {variant: 'error'});  
      setChangeNameError(error);
      return;
    }
    setChangeNameError("");
    onSubmitChangeName(changeName);
    setOpenVersionName(false);
    setAnchorEl(null);
  };

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
    
    const transform = getTransformForBounds(nodesBounds, nodesBounds.width, nodesBounds.height, 0.2, 2, 0);



    const content = document.querySelector('.react-flow__viewport'); // The content you want to capture

    const endMarker = document.getElementById('endMarkerParent');
    const startMarker = document.getElementById('startMarkerParent');

     // Copying markers to view port so they can be printed. They can staty there
    content.appendChild(endMarker);
    content.appendChild(startMarker); 

    const infoTable = createProjectInfoTable(nodesBounds.x, nodesBounds.y+nodesBounds.height+30, projectName, projectDescription, projectCreatorName, lastChange, countTables, countColumns, countRels);
    content.appendChild(infoTable);

    const tableInfoHeight = infoTable.offsetHeight;
    const scaledTableInfoHeight = parseInt(tableInfoHeight * transform[2]);

    // Addiing footer image
    const imageDiv = document.createElement('div');
    imageDiv.innerHTML = '<img src="/images/kleandbmaiBlue.svg" width="140px" height="17px"/>';


    imageDiv.style.position = 'absolute';
    imageDiv.style.left = `${nodesBounds.x+nodesBounds.width-150}px`;
    //imageDiv.style.top = `${nodesBounds.y+nodesBounds.height+parseInt(scaledTableInfoHeight/2)+24}px`;
    imageDiv.style.top = `${nodesBounds.y + nodesBounds.height + scaledTableInfoHeight}px`;
    content.appendChild(imageDiv);
    
    toPng(content, {
      backgroundColor: '#ffffff',
      width: nodesBounds.width+40, // Edge padding
      height: nodesBounds.height+scaledTableInfoHeight+40+20, //Leavign extra room for information table + 20 margin
      style: {
        width: nodesBounds.width+40, // Edge padding
        height: nodesBounds.height+scaledTableInfoHeight+40+20,//Leavign extra room for information table + 20 margin
        transform: `translate(${transform[0]+20}px, ${transform[1]+20}px) scale(${transform[2]})`,
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
            sx={{ ml: 2, padding:0, marginLeft:0 }}
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
          <Stack p={.5} direction="column" sx={{ width: 450 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" paddingRight={2}>
              <TextField
                sx={{
                
                width: 380,
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
                inputProps={{style: {fontWeight:"bold", fontSize: 18, color:"text.primary"}}} 
                variant="outlined"
                value={projectName}
                onChange = {onProjectNameChange}
                onBlur={onProjectNameBlur}
              />
              <Tooltip title={lookupDbTechnology(dbTechnology)}>
                  <Avatar 
                      aria-label="Technology"
                      src={`/images/${lookupDbTechnology(dbTechnology)}.png`}
                      sx={{ width: 24, height: 24}}
                  />
              </Tooltip>
            </Stack>
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
                  inputProps={{style: {color:"text.primary"}}} 
                  variant="outlined"
                  multiline
                  value={projectDescription}
                  onChange = {onProjectDescriptionChange}
                  onBlur={onProjectDescriptionBlur}
              />
          </Stack>
          <Stack spacing={1} p={2.5} order='column' sx={{width:'100%'}} >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                      <strong>Author:</strong> {projectCreatorName}
                  </Typography>
              </Box>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center'}}>
                    <AccessTimeIcon sx={{width:16, height:16}}/>
                    <span style={{ marginLeft: 4 }}>
                        Last Modified: {toLocalTime(lastChange.timestamp)}
                    </span>
                </Typography>
              </Box>      
          </Stack>
          <Divider /> 
          <Stack p={2} direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            <Stack direction="column" spacing={.1} justifyContent="space-between" alignItems="center" >
              <Typography variant="h3" sx={headerStyle}>{countTables}</Typography>
              <Typography variant="body2" sx={labelStyle}>Tables</Typography>
            </Stack>
            <Stack direction="column" spacing={.1} justifyContent="space-between" alignItems="center" >
              <Typography variant="h3" sx={headerStyle}>{countColumns}</Typography>
              <Typography variant="body2" sx={labelStyle}>Columns</Typography>
            </Stack>
            <Stack direction="column" spacing={.1} justifyContent="space-between" alignItems="center" >
              <Typography variant="h3" sx={headerStyle}>{countRels}</Typography>
              <Typography variant="body2" sx={labelStyle}>Relationships</Typography>
            </Stack>
          </Stack>
          <Divider />
          <MenuItem>
              <ListItemIcon>
                  <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>See version history</ListItemText>
          </MenuItem> 
          <MenuItem onClick={() => {setOpenVersionName(true)}}>
              <ListItemIcon>
                  <EmojiFlagsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Name this version</ListItemText>
          </MenuItem>
          <Divider /> 
          <MenuItem  onClick={() => {setOpenNamigRules(true)}}>
              <ListItemIcon>
                  <SpellcheckIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit naming conventions</ListItemText>
          </MenuItem>
          <MenuItem  onClick={() => {setOpenSqlWindow(true)}}>
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
          {openSqlWindow && <SQLCodeDisplay 
              projectId={projectId}
              handleClose={() => {setOpenSqlWindow(false), handleClose()}}
          />}
          {openNamingRules && <NamingRulesEditor 
              projectId={projectId}
              onDone={() => {setOpenNamigRules(false), handleClose()}}
              onCancel={() => {setOpenNamigRules(false), handleClose()}}
          />}
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
            name="versionName"
            label="Version Name"
            type="text"
            fullWidth
            variant="standard"
            value={changeName} // Set the value of the TextField
            onChange={(e) => setChangeName(e.target.value)} 
            error={changeNameError !== ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpenVersionName(false)}}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
        </Popover>
    </React.Fragment>
  );
}