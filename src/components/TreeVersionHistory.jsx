import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses} from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const groupChangesByDate = (changes) => {
    return changes.reduce((acc, change) => {
        const localRawDate = new Date(change.timestamp + 'Z');
        const localDate = localRawDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }); 
      //const localDate = new Date(parseISO(change.timestamp)).toLocaleDateString();
        if (!acc[localDate]) {
            acc[localDate] = [];
        }
        acc[localDate].push(change);
        return acc;
    }, {});
  };

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
    
    return `${formattedTime}`;
  }

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(0),
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
  

export default function TreeVersionHistory({changesList}) {
  const navigate = useNavigate();

  const [displayVersions, setDisplayVersions] = React.useState('all');

  const groupedChanges = groupChangesByDate(changesList);
  const groupedChangesArray = Object.entries(groupedChanges).map(([date, changesList]) => ({
    id: date,
    changes: changesList,
  }));

  const handleDisplayVersionsChange = (event) => {
    setDisplayVersions(event.target.value);
  };

  console.log(groupedChanges);
  console.log(groupedChangesArray);

  return (
    <>
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
        <TreeView
            aria-label="tree navigator"
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}
            >
            {groupedChangesArray.map((entry) => (
                <StyledTreeItem key={entry.id} nodeId={entry.id} labelText={entry.id}>
                {entry.changes.map((change) => (
                    <StyledTreeItem
                        nodeId={change.id}
                        key={change.id}
                        labelText={change.name || toLocalTime(change.timestamp)}
                        labelTime={change.name && toLocalTime(change.timestamp)}
                        isLeaf={true}
                        color="#1a73e8"
                        bgColor="#e8f0fe"
                        colorForDarkMode="#B8E7FB"
                        bgColorForDarkMode="#071318"
                    />
                ))}
                </StyledTreeItem>
            ))}
        </TreeView>
    </>
  );
}