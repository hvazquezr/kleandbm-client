import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';


const actions = [
  { icon: <TableChartOutlinedIcon />, name: 'Add Table' },
  { icon: <StickyNote2OutlinedIcon />, name: 'Add Note' }
];

export default function ActionMenu({handleAddTable}) {

  return (
    <Box sx={{ height: 200, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Action Menu"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        direction='down'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key = {action.name}
            icon = {action.icon}
            tooltipTitle = {action.name}
            onClick = {handleAddTable}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}