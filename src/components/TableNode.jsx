import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default memo(({data, isConnectable}) => {

    return (
    <>
        <Handle
            type="target"
            position={Position.Top}
            style={{ background: '#555' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} size="small" aria-label="{data.label}">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>{data.label}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Data&nbsp;Type</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.columns.map((column) => (
                <TableRow
                    key={column.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                    {column.name}
                    </TableCell>
                    <TableCell align="right">{column.datatype}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            style={{background: '#555' }}
            isConnectable={isConnectable}
      />
    </>
    );
});