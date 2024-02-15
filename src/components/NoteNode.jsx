import React, { memo, useState } from 'react';
import { NodeResizer } from 'reactflow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const style = {
    
    border: 1,
    color: '#80553a',
    borderColor: '#66442c',
    borderRadius: 1.5,
    padding: 1,
    background: "#fcfce6",
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  };

const NoteNode = ({ data, selected }) => {
    const [value, setValue] = useState(data.text);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

  return (
    <>
      <NodeResizer color="#047cdc" lineStyle={{borderWidth: 1.5}} isVisible={selected} minWidth={150} minHeight={40} />
      <Box sx={style} >
        <TextField multiline value={value} onChange={handleChange} fullWidth variant="outlined"
            InputProps={{
                    style: { padding: '0px', color: '#80553a', border: 'none'} // Adjust the padding value as needed
            }}
              // Remove border from the TextField component, including when focused
            sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': { // Hide the border of the TextField itself
                    border: 'none',
                },
                '&:hover fieldset': { // Hide the border on hover
                    border: 'none',
                },
                '&.Mui-focused fieldset': { // Hide the border when the TextField is focused
                    border: 'none',
                },
                },
            }}
        />
      </Box>
    </>
  );
};

export default memo(NoteNode);