import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

import { CopyBlock, CodeBlock, hopscotch } from 'react-code-blocks';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';


import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {apiUrl} from '../config/UrlConfig'

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
      let pollingInterval;
      const pollJobStatus = async (jobId) => {
          try {
              const token = await getAccessTokenSilently();
              const statusResponse = await axios.get(`${apiUrl}/jobs/${jobId}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              if (statusResponse.data && statusResponse.data.result !== null) {
                  clearInterval(pollingInterval);
                  setSql(statusResponse.data.result.sql); // Assuming result has the SQL data
              }
          } catch (error) {
              console.error("Error polling job status", error);
              clearInterval(pollingInterval);
          }
      };
  
      const fetchSql = async () => {
          try {
              const token = await getAccessTokenSilently();
              const response = await axios.get(`${apiUrl}/projects/${projectId}/sql`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              const jobId = response.data.jobId; // Assuming jobId is returned
              // Wait for 15 seconds before starting to poll
              setTimeout(() => {
                  pollingInterval = setInterval(() => pollJobStatus(jobId), 5000);
              }, 15000);
  
          } catch (error) {
              console.error("Error fetching sql", error);
          }
      };
  
      fetchSql();
  
      return () => {
          clearInterval(pollingInterval); // Clear polling interval on cleanup
      };
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