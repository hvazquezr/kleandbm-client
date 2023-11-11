import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grow from '@mui/material/Grow';
import LoginButton from '../components/LoginButton';


export default function LandingPage() {
    return (
    <Box sx={{ flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/logo.png"} width="150" height="24"/>
                    <LoginButton />                    
                </Stack>
            </Toolbar>
        </AppBar>
        <Box component="main" sx={{p: 10}}>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center" sx={{width:'100%', height: '70vh'}}>
                <Grow in={true}>
                    <Typography variant="h1">Coming soon...</Typography>
                </Grow>
            </Stack>
        </Box>
    </Box>
  );
}