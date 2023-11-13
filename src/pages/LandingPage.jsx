import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LoginButton from '../components/LoginButton';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import { TypeAnimation } from 'react-type-animation';
import Button from '@mui/material/Button';



export default function LandingPage() {
    return (
    <Box sx={{ flexGrow: 1}}>
        <CssBaseline />
        <AppBar position="static" sx={{ bgcolor: "white", paddingLeft:7, paddingRight:7}}>
            <Toolbar>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{width:'100%'}}>
                    <img src={"./images/bluelogo.png"} width="150" height="24"/>
                    <LoginButton />                    
                </Stack>
            </Toolbar>
        </AppBar>
        <Box component="main" sx={{p: 10, height:'90vh'}}>
            <Stack direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={5}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={5}
                alignItems="center"
                justifyContent="center"
                divider={<Divider orientation="vertical" flexItem/>}
                sx={{width:'100%'}}>
                    <img src={"./images/projectsPlaceholder.png"} style={{ borderRadius: '50%', width:'300px', height:'300px' }}/>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h2" sx={{color:"#535354"}}>AI-Driven Database Design <span style={{color:"#1080DB"}}>Simplified</span></Typography>
                        <Typography variant="h5">
                        <TypeAnimation
                            style={{ whiteSpace: 'pre-line', height:140, display: 'block' }}
                            sequence={[
                                `What is my daily revenue by region?\nWhich products are our top sellers every month?\nHow effective is our supply chain in terms of delivery times?\n...`
                                ]}
                            repeat={0}
                        />
                        </Typography>
                    </Stack>
                </Stack>
                <Button size='large' color='success' variant='contained'>Sign Up</Button>
            </Stack>
        </Box>
    </Box>
  );
}