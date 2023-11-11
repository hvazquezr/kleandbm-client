import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grow from '@mui/material/Grow';
import LoginButton from '../components/LoginButton';
import CssBaseline from '@mui/material/CssBaseline';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';


export default function LandingPage() {
    return (
    <Box sx={{ flexGrow: 1}}>
        <CssBaseline />
        <AppBar position="static">
            <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/logo.png"} width="150" height="24"/>
                    <Button component={Link} to={'/dashboard'} size="medium" variant="outlined" color="inherit">Link</Button>
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