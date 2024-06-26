import React, { memo, useState, useContext, useRef, useCallback, useEffect} from 'react';
import { NodeResizer } from 'reactflow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import UndoContext from './UndoContext';

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

const NoteNode = ({ id, data, selected }) => {
    const [value, setValue] = useState(data.text);
    const { addToUndoStack, updateNotePartial } = useContext(UndoContext); 
    const previousTextRef = useRef(data.text);

    useEffect(() => {
      setValue(data.text);
    }, [data]);

    const handleChange = useCallback((evt) => {
        setValue(evt.target.value);
      }, []);

    const saveText = () => {
        updateNotePartial({id, text: value});
        addToUndoStack(() => updateNotePartial({id, text:previousTextRef.current}));
    };

    const saveNewSize = (e, params) => {
      updateNotePartial({id, width: params.width, height: params.height});
      addToUndoStack(() => updateNotePartial({id, width:data.previousWidth, height:data.previousHeight}));
    };

    const savePreviousText = () => {
        previousTextRef.current = value;
    };

  return (
    <>
      <NodeResizer color="#047cdc" lineStyle={{borderWidth: 1.5}} isVisible={selected} minWidth={150} minHeight={40} onResizeEnd={saveNewSize} />
      <Box sx={style} >
        <TextField multiline value={value} onChange={handleChange} fullWidth variant="outlined" className="nodrag"
        onBlur={saveText}
        onFocus={savePreviousText}
            placeholder='Enter comments here.'
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