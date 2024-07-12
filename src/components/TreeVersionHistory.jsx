import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses} from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import VersionMenu from './VersionMenu';

const groupChangesByDate = (changes) => {
    return changes.reduce((acc, change) => {
        const localRawDate = new Date(change.timestamp + 'Z');
        const localDate = localRawDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short', // Use 'long' to get the full month name
            day: 'numeric'
        }); 
      //const localDate = new Date(parseISO(change.timestamp)).toLocaleDateString();
        if (!acc[localDate]) {
            acc[localDate] = [];
        }
        acc[localDate].push(change);
        return acc;
    }, {});
  };

const filterItemsWithNonNullName = (items) => {
    return items.filter(item => item.name !== null);
};

function toLocalTime(isoDate) {
    const localDate = new Date(isoDate + 'Z');
  
    const formattedDate = localDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short', // Use 'long' to get the full month name
      day: 'numeric'
    });
    
    const formattedTime = localDate.toLocaleTimeString(undefined, {
      hour: 'numeric', // Use 'numeric' to avoid leading zeros
      minute: '2-digit',
      hour12: true // Set to true for 12-hour format with AM/PM
    });
    
    return `${formattedDate}, ${formattedTime}`;
  }

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    paddingLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(0),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const theme = useTheme();
    const {
      bgColor,
      color,
      labelIcon,
      labelInfo,
      labelText,
      labelTime = null,
      colorForDarkMode,
      bgColorForDarkMode,
      isLeaf = false, // Default to false if not provided
      handleVersionMoreClick,
      changeId,
      ...other
    } = props;
  
    const styleProps = {
      '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
      '--tree-view-bg-color':
        theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };
  
    return (
        <>
      <StyledTreeItemRoot
        label={
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
            pl: 0,
            ...(isLeaf ? { height: 60 } : {})
          }}
          >
                <Box component={labelIcon} color="inherit" sx={{ mr: 1 }} />
                <Box m={0} p={0} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography m={0} p={0} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    {labelTime && (
                            <Typography m={0} p={0} variant="caption" sx={{ fontStyle: 'italic', fontWeight: 'regular', flexGrow: 1 }}>
                                {labelTime}
                            </Typography>
                        )}
                </Box>
                {isLeaf && 
                <Tooltip title="More">
                    <IconButton
                        size="small"
                        sx={{ ml: 2, padding:0, marginLeft:0 }}
                        onClick={(event) => handleVersionMoreClick(event, changeId)}
                    >
                        <MoreVertIcon fontSize="small" sx={{color:'#DDD' }}/>
                    </IconButton>
                </Tooltip> 
                }
          </Box>
        }
        style={styleProps}
        {...other}
        ref={ref}
      />

        </>
    );
  });
  
export default function TreeVersionHistory({changesList, updateChangeName, selectedChange, setSelectedChange}) {

  const [displayVersions, setDisplayVersions] = React.useState('all');
  const [versionMenuOptions, setVersionMenuOptions] = React.useState(null);

  const groupedChanges = groupChangesByDate(changesList);
  const groupedChangesArray = Object.entries(groupedChanges).map(([date, changesList]) => ({
    id: date,
    changes: changesList,
  }));

  const handleVersionMoreClick = (event, changeId) => {
    const change = changesList.find(change => change.id === changeId);
    const vmo = {anchorEl: event.currentTarget, change};
    setVersionMenuOptions(vmo);
  };
  
  const handleClose = () => {
    setVersionMenuOptions(null);
  };

  const changesWithName = filterItemsWithNonNullName(changesList)

  const handleDisplayVersionsChange = (event) => {
    setDisplayVersions(event.target.value);
  };


  return (
    <React.Fragment>
        <Typography variant="h6" p={2} paddingBottom={0}>
            Version History
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
                value={displayVersions}
                onChange={handleDisplayVersionsChange}
            >
                <MenuItem value="all">All versions</MenuItem>
                <MenuItem value="named">Named versions</MenuItem>
            </Select>
        </FormControl>
        {groupedChangesArray &&
        <TreeView
        aria-label="tree navigator"
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}
        expanded={[groupedChangesArray[0].id]}
        selected={[selectedChange]}
        >
      {displayVersions === "all" ? (
        groupedChangesArray.map((entry) => (
          <StyledTreeItem key={entry.id} nodeId={entry.id} labelText={entry.id}>
            {entry.changes.map((change) => (
              <StyledTreeItem
                nodeId={change.id}
                key={change.id}
                changeId={change.id}
                labelText={change.name || toLocalTime(change.timestamp)}
                labelTime={change.name && toLocalTime(change.timestamp)}
                onClick={() => {setSelectedChange(change.id)}}
                isLeaf={true}
                color="#1a73e8"
                bgColor="#e8f0fe"
                colorForDarkMode="#B8E7FB"
                bgColorForDarkMode="#071318"
                handleVersionMoreClick = {handleVersionMoreClick}
              />
            ))}
          </StyledTreeItem>
        ))
      ) : changesWithName.length > 0 ? (
        changesWithName.map((change) => (
          <StyledTreeItem
            nodeId={change.id}
            key={change.id}
            changeId={change.id}
            labelText={change.name || toLocalTime(change.timestamp)}
            labelTime={change.name && toLocalTime(change.timestamp)}
            onClick={() => {setSelectedChange(change.id)}}
            isLeaf={true}
            color="#1a73e8"
            bgColor="#e8f0fe"
            colorForDarkMode="#B8E7FB"
            bgColorForDarkMode="#071318"
            handleVersionMoreClick = {handleVersionMoreClick}
          />
        ))
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body2">
            There are no named versions
          </Typography>
        </Box>
      )}
    </TreeView>}
    {versionMenuOptions && <VersionMenu 
        versionMenuOptions={versionMenuOptions}
        onClose={handleClose}
        onUpdateChangeName = {updateChangeName}
    />
}
    </React.Fragment>
  );
}