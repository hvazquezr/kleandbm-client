import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, Box, Button, Typography, CssBaseline } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );

function NewProjectPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);



  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="persistent"
        hideBackdrop={false}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {/* Drawer content */}
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h6" noWrap>
            Drawer Content
          </Typography>
          {/* Add more content or navigation items here */}
        </Box>
      </Drawer>
      <Main open={drawerOpen} sx={{p:0}}>
        <Button onClick={toggleDrawer}>Toggle Drawer</Button>
        {/* Main content */}
        <Typography paragraph>
          Main Section Content
        </Typography>
      </Main>
    </Box>
  );
}

export default NewProjectPage;