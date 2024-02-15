import React, { memo } from 'react';
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
    borderRadius: 1.5,
    background: "#ffffff"
  };

export default memo(({data, isConnectable}) => {

    return (
    <>
        <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            //isConnectableStart={false}
        />
        <TableContainer sx={style}>
            <Table size="small" aria-label="{data.label}">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3} sx={{fontWeight: 'bold', backgroundColor: '#EEE'}}>
                            {data.name}                         
                        </TableCell>
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
                        <TableCell align="right">
                            {column.dataType +
                                (column.maxLength ? `(${column.maxLength})` :
                                column.precision && column.scale ? `(${column.precision}, ${column.scale})` :
                                column.precision ? `(${column.precision})` :
                                column.scale ? `(${column.scale})` : '')}
                        </TableCell>

                        <TableCell align="right" sx={{color:green[800], fontWeight:'bold'}}>{column.primaryKey?'PK':''}</TableCell>
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