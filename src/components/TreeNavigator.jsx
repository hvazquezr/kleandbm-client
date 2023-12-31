import React, { useCallback } from 'react';
import {useReactFlow} from 'reactflow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';


export default function TreeNavigator({tableList}) {
  const navigate = useNavigate();

  const {fitView } = useReactFlow();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <TreeView
      aria-label="tree navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
        <TreeItem
            nodeId="home"
            label={<Typography variant="body1">Home</Typography> }
            icon={<HomeIcon />}
            onClick={() => handleNavigation('/dashboard')}
        />
        <TreeItem 
            nodeId="tables" 
            label={<Typography variant="body1">Tables</Typography> }
        >
        {tableList.map((table) => (
            <TreeItem
                onClick={() => {fitView({nodes: [{id: table.id}], duration:500, maxZoom:1.5})}}
                nodeId = {table.id}
                key = {table.id}
                label={
                  <Typography variant="body2">{table.data.name}</Typography> 
                }
                icon = {<TableChartOutlinedIcon />}
            />
        ))}
      </TreeItem>
    </TreeView>
  );
}