import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { green } from '@mui/material/colors';

const style = {
    
    border: 1,
    color: '#666666',
    minWidth: 100,
    borderRadius: 2,
    background: "#ffffff"
  };

export default memo(({data, isConnectable}) => {

    return (
    <>
        <Handle
            type="target"
            position={Position.Top}
            style={{ background: '#555' }}
            isConnectable={isConnectable}
        />
        <TableContainer sx={style}>
            <Table size="small" aria-label="{data.label}">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3}>
                            {data.name}                         
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight: 'normal'}} align="left">Name</TableCell>
                        <TableCell sx={{fontWeight: 'normal'}} align="left">Data&nbsp;Type</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.columns.map((column) => (
                    <TableRow
                        key={column.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell >
                        {column.name}
                        </TableCell>
                        <TableCell align="right">{column.dataType}</TableCell>
                        <TableCell align="right" sx={{color:green[800]}}>{column.primaryKey?'PK':''}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: '#555' }}
            id="a"
            isConnectable={isConnectable}
        >
      </Handle>
    </>
    );
});