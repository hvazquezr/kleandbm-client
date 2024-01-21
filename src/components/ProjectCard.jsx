import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardMedia, CardContent, Typography, Avatar, IconButton } from '@mui/material';
import { AccessTime as AccessTimeIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

import { databaseTechnologies } from '../config/Constants.jsx';


function lookupDbTechnology(id) {
    const dbTechnology = databaseTechnologies.find(dbTechnology => dbTechnology.id === id);
    return dbTechnology ? dbTechnology.name : null;
}

function capitalizeFirstLetter(word) {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function epochToLocalTime(epoch) {
    const date = new Date(epoch);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    return `${formattedDate} ${formattedTime}`;
}

function ProjectCard({ project, user }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${project.id}`);
    };

    console.log(`/images/${lookupDbTechnology(project.dbTechnology)}.png`);

    return (
        <Card 
            sx={{ 
                maxWidth: 345, 
                cursor: 'pointer', 
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)', // Slightly scale up the card on hover
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' // Increase shadow on hover
                }
            }} 
            onClick={handleClick}
        >
            <CardHeader
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {project.name}
                        <Avatar 
                            aria-label="Technology"
                            src={`/images/${lookupDbTechnology(project.dbTechnology)}.png`}
                            sx={{ 
                                width: 24,   // Smaller width
                                height: 24
                            }}
                        />
                    </div>
                }
                //subheader={lookupDbTechnology(project.dbTechnology)}
            />
            <CardMedia
                component="img"
                height="194"
                image="/images/projectsPlaceholder.png"
                alt="Project image"
            />
            <CardContent>
                <Typography variant="body2" color="text.primary" sx={{height:60, lineClamp: 3, textOverflow:'ellipsis'}}>
                        {project.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{paddingTop:1}}>
                    <strong>Author:</strong> {project.owner.id===user.sub?"Me":project.owner.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', paddingTop:.2 }}>
                        <AccessTimeIcon fontSize="small" />
                        <span style={{ marginLeft: 4 }}>Last Modified: {epochToLocalTime(project.lastModified)}</span>
                </Typography>

            </CardContent>
        </Card>
    );
}

export default ProjectCard;
