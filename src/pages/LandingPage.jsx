import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grow from '@mui/material/Grow';
import {Link} from 'react-router-dom';


export default function LandingPage() {
    return (
    <Box sx={{ flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/logo.png"} width="150" height="24"/>
                    <Button component={Link} to={'/dashboard'} size="medium" variant="outlined" color="inherit">Login</Button>
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