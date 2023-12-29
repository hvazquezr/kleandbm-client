import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';


export default function ActionMenu({handleAddTable, handleAddTableWithAI}) {
  console.log(handleAddTableWithAI);
  return (
    <Box sx={{ height: 250, transform: 'translateZ(0px)', flexGrow: 1}}>
      <SpeedDial
        ariaLabel="Action Menu"
        sx={{ position: 'absolute', bottom: 16, right: 0 }}
        icon={<SpeedDialIcon />}
        direction='down'
      >
          <SpeedDialAction
            key = 'addTable'
            icon = {<TableChartOutlinedIcon />}
            tooltipTitle = 'Add Table'
            onClick = {handleAddTable}
          />    
          <SpeedDialAction
            key = 'addTableWithAI'
            icon = {<PsychologyIcon color="secondary"/>}
            tooltipTitle = 'Add Table with AI'
            onClick = {handleAddTableWithAI}
          />
          <SpeedDialAction
            key = 'addNote'
            icon = {<StickyNote2OutlinedIcon />}
            tooltipTitle = 'Add Note'
            //onClick = {}
          />    
      </SpeedDial>
    </Box>
  );
}