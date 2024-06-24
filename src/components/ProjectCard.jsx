import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardMedia, CardContent, Typography, Avatar, Grid, Tooltip } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { lookupDbTechnology } from './utils';

import {apiUrl} from '../config/UrlConfig'


function toLocalTime(isoDate) {
    const localDate = new Date(isoDate + 'Z');
  
    const formattedDate = localDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    const formattedTime = localDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Set to true if you want 12-hour format with AM/PM
    });
    
    return `${formattedDate} ${formattedTime}`;
  }

function ProjectCard({ project, user }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${project.id}`);
    };
    return (
        <Card
            sx={{
                display: 'flex',
                maxHeight: 150,
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }
            }}
            onClick={handleClick}
        >
            <Grid container direction="row" sx={{ flex: 1 }}>
                <Grid item sx={{width:'100%'}}>
                    <CardHeader
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'100%' }}>
                                <span style={{textOverflow:'ellipsis', width:'320px', overflow:'hidden'}}>{project.name}</span>
                                <Tooltip title={lookupDbTechnology(project.dbTechnology)}>
                                    <Avatar 
                                        aria-label="Technology"
                                        src={`/images/${lookupDbTechnology(project.dbTechnology)}.png`}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                </Tooltip>
                            </div>
                        }
                    />
                    <CardContent sx={{paddingTop:0}}>
                        <Typography variant="body2" color="text.primary" sx={{height:'43px', overflow:'clip'}}>
                            {project.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Author:</strong> {project.owner.id === user.sub ? "Me" : project.owner.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center'}}>
                            <AccessTimeIcon sx={{width:16, height:16}}/>
                            <span style={{ marginLeft: 4 }}>
                                Last Modified: {toLocalTime(project.lastChange.timestamp)}
                            </span>
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ProjectCard;
