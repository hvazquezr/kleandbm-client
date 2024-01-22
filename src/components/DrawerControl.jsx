import * as React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';

export default function DrawerControl({
    handleDrawerOpen,
    openDrawer
    }) {

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'center' }}>
        <Tooltip title="Navigation Panel">
          <IconButton
            onClick={handleDrawerOpen}
            size="small"
            sx={{ ml: 2, padding:0, marginLeft:0, opacity: 20 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MenuIcon sx={{ width: 30, height: 30, color:'#DDD' }}/>
          </IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
}