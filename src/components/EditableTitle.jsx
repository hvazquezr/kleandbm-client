import React from 'react';

import { TextField } from '@mui/material';

export default function EditableTitle({value, onChange, onBlur}){
    return(
        <TextField
        sx={{
        width: { sm: 250, md: 400 },
        "& .MuiOutlinedInput-root": {
            "& > fieldset": {
            borderColor: "#1976d2"
            }
        },              
        "& .MuiOutlinedInput-root:hover": {
            "& > fieldset": {
            boder: "1 px",
            borderColor: "white"
            }
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
            boder: "1 px",
            borderColor: "white"
            }
        }
        }}
        inputProps={{style: {fontWeight:"bold", fontSize: 18, color:"white"}}} 
        variant="outlined"
        value={value}
        onChange = {onChange}
        onBlur={onBlur}
        />
    )
}