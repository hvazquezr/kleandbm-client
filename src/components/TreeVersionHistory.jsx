import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {useReactFlow} from 'reactflow';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses} from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
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
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const theme = useTheme();
    const {
      bgColor,
      color,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
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
      <StyledTreeItemRoot
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              pr: 0,
            }}
          >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
            {isLeaf && (
              <Tooltip title="More">
                <IconButton
                    size="small"
                    sx={{ ml: 2, padding:0, marginLeft:0 }}
                >
                    <MoreVertIcon fontSize="small" sx={{color:'#DDD' }}/>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        style={styleProps}
        {...other}
        ref={ref}
      />
    );
  });
  

export default function TreeNavigator({tableList}) {
  const [sortedTables, setSortedTables] = useState([]);
  const navigate = useNavigate();
  const {fitView } = useReactFlow();

  const [displayVersions, setDisplayVersions] = React.useState('all');

  const handleDisplayVersionsChange = (event) => {
    setDisplayVersions(event.target.value);
  };

  //Use useEffect to update the sorted array whenever the passed array changes
  useEffect(() => {
    // Create a copy of the array and sort it to avoid modifying the original array
    let sortedCopy = tableList.filter(element => element.type === 'tableNode');
    sortedCopy.sort((a, b) => a.data.name.localeCompare(b.data.name));
    // Update the component's state with the sorted array
    setSortedTables(sortedCopy);
  }, [tableList]); 

  const handleNavigation = (path) => {
    navigate(path);
  };

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
        defaultExpanded={['1']}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{flexGrow: 1, width:'100%', overflowY: 'auto' }}
        >
            <StyledTreeItem nodeId="tables" labelText="Tables">
            {sortedTables.map((table) => (
                <StyledTreeItem
                onClick={() => {fitView({nodes: [{id: table.id}], duration:500, maxZoom:1.5})}}
                nodeId={table.id}
                key = {table.id}
                labelText={table.data.name}
                color="#1a73e8"
                bgColor="#e8f0fe"
                colorForDarkMode="#B8E7FB"
                bgColorForDarkMode="#071318"
                isLeaf={true}
                />
            ))}
            </StyledTreeItem>
        </TreeView>
    </>
  );
}