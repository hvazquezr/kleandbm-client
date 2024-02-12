import React, {useState, useEffect, useRef} from 'react';
import { ReactSortable } from "react-sortablejs";
import { Stack, Box, Tooltip, Typography, Button } from '@mui/material';
import './css/ColumnEditor.css';
import { ColumnEditor } from './ColumnEditor';
import AddIcon from '@mui/icons-material/Add';

const ColumnListEditor = ({ columns, setColumns, dataTypes, onUpdateColumn, onAddColumn, onRemoveColumn, columnErrors}) => {
    const endOfListRef = useRef(null); // Ref to the end marker for scrolling
    const prevColumnsLength = useRef(columns.length); // Ref to store the previous length of columns

    useEffect(() => {
        // Check if a new item was added by comparing lengths
        if (columns.length > prevColumnsLength.current && endOfListRef.current) {
            endOfListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // Update the previous length for the next render
        prevColumnsLength.current = columns.length;
    }, [columns.length]);
      

    return (
    <Stack direction="column" p={0} s={1}>
        <Box display="flex" justifyContent="flex-end" paddingBottom={2}>
            <Tooltip title="Add Column">
                <Button variant='contained' size='small' onClick={onAddColumn}><AddIcon /></Button>
            </Tooltip>
        </Box>
        <Stack className="grid-header" direction="row">
            <Box sx={{width:36}}></Box>
            <Box sx={{width:184}}><Typography variant='overline'>Name</Typography></Box>
            <Box sx={{width:162}}><Typography variant='overline'>Data Type</Typography></Box>
            <Box sx={{width:78}}><Tooltip title="Max length"><Typography variant='overline'>ML</Typography></Tooltip></Box>
            <Box sx={{width:78}}><Tooltip title="Precision"><Typography variant='overline'>P</Typography></Tooltip></Box>
            <Box sx={{width:70}}><Tooltip title="Scale"><Typography variant='overline'>S</Typography></Tooltip></Box>
            <Box sx={{width:30}}><Tooltip title="Primary Key"><Typography variant='overline'>PK</Typography></Tooltip></Box>
            <Box sx={{width:26}}><Tooltip title="Can be Null"><Typography variant='overline'>N</Typography></Tooltip></Box>
            <Box sx={{width:23}}><Tooltip title="Auto Increment"><Typography variant='overline'>A</Typography></Tooltip></Box>
            <Box><Typography variant='overline'>Description</Typography></Box>
        </Stack>
        <Box overflow="auto" className="grid">
            <Stack direction="column" spacing={0} >
            <ReactSortable
                filter=".addImageButtonContainer"
                dragClass="item-dragging"
                list={columns}
                setList={setColumns}
                animation="200"
                easing="ease-out"
                dataIdAttr="id"
            >
                {columns.map((column) => (
                    <Stack direction="row" padding={.5} alignItems="center" justifyContent="flex-start" spacing={.5} sx={{width:850}} key={column.id} className='item'>
                        <ColumnEditor column={column}  onColumnChange={onUpdateColumn} dataTypes={dataTypes} onRemoveColumn={onRemoveColumn} columnErrors={columnErrors} />
                    </Stack>
                    ))}
                <div ref={endOfListRef} />  
                </ReactSortable>
            </Stack>
        </Box>
    </Stack>
    );
};

export default ColumnListEditor;
