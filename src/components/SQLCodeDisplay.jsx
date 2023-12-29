import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

import { CopyBlock, CodeBlock, hopscotch } from 'react-code-blocks';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';


import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

const boxStyle = {
  position: 'relative', // To support cancel button
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 10,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cancelButtonStyle = {
    position: 'absolute',
    top: -15, // Adjust as needed for spacing from the top
    right: -15, // Adjust as needed for spacing from the right
    height: 30,
    width: 30
    // Additional styling as needed (e.g., background, border, etc.)
  };

  const cancelIconStyle = {
    height: 30,
    width: 30,
    backgroundColor: '#FFF',
    borderRadius: '50%'
  }

const buttonStyle = {
    width: 200
};

export default function SQLCodeDisplay({projectId, handleClose}) {
    const [sql, setSql] = useState(null);
    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        const fetchSql = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`http://127.0.0.1:5000/api/v1/projects/${projectId}/sql`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setSql(await response.data.sql);
            } catch (error) {
                console.error("Error fetching sql", error);
            }
        };
        fetchSql();
    }, [projectId]);

    return(
        <Modal open={true}>
            <Box sx={boxStyle}>
                <IconButton sx={cancelButtonStyle} aria-label="fingerprint" color="primary" onClick={handleClose} size="large">
                    <CancelIcon sx={cancelIconStyle}/>
                </IconButton>
                {(sql===null) && <CircularProgress />}
                {sql && <CopyBlock
                        text={sql}
                        language="sql"
                        showLineNumbers={true}
                        theme={hopscotch}
                        wrapLines
                        //codeBlock
                        customStyle={{
                            height: '100%',
                            overflow: 'scroll',
                            width: '100%'
                          }}
                        //onClick={() => {alert('Copied code'); copy(sql)}}
                    />}
                </Box>
        </Modal>
    );
}