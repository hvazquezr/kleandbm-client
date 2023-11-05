import * as React from 'react';
import { useState, useEffect } from 'react';

import Modal from '@mui/material/Modal';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: 600,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
};

const buttonStyle = {
    width: 200
}

const stackStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: 600,
    p: 4,
  };


export default function TableEditor({table, onClose}) {
    const [tableName, setTableName] = useState(table.data.label);
    const [columns, setColumns] = useState(table.data.columns);

    useEffect (() => {
        setTableName(table.data.label);
        setColumns(table.data.columns);
    }, [table]);



    return(
        <Modal>
            Hello
        </Modal>
    );
}