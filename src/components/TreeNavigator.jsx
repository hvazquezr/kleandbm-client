import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';


export default function TreeNavigator({tableList}) {
  return (
    <TreeView
      aria-label="tree navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
        <TreeItem 
            nodeId="tables" 
            label="Tables"
        >
        {tableList.map((table) => (
            <TreeItem
                nodeId = {table.id}
                key = {table.id}
                label={table.data.label}
                icon = {<TableChartOutlinedIcon />}
            />
        ))}
      </TreeItem>
    </TreeView>
  );
}