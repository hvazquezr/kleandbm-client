import React, { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import {
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from 'reactflow';

import Flow from '../components/Flow.jsx';
import TreeNavigator from '../components/TreeNavigator.jsx';
import TreeVersionHistory from '../components/TreeVersionHistory.jsx';
import TableNode from '../components/TableNodeVersionHistory.jsx';
import NoteNode from '../components/NoteNode.jsx';
import FloatingEdge from '../components/FloatingEdge.jsx';
import FloatingConnectionLine from '../components/FloatingConnectionLine.jsx'
import UserAvatar from '../components/UserAvatar.jsx';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useSnackbar } from 'notistack';

import LoadingPage from './LoadingPage.jsx';

import 'reactflow/dist/style.css';
import '../components/css/kalmdbm.css';
import { getCurrentIsoTime} from '../components/utils.jsx';

const drawerWidth = 240;
const versionDrawerWidth = 240;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    width: `calc(100vw - ${versionDrawerWidth}px)`,
    ...(open && {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: `calc(100vw - ${drawerWidth}px - ${versionDrawerWidth}px)`,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


function readyNodesAndEdges(jsonData) {
  // Destructure the jsonData
  const { tables, relationships, nodes } = jsonData;
  
  // Filter nodes for those with nodeType equal to 'tableNode'
  const tableNodes = nodes.filter(node => node.type === 'tableNode');

  // Filter and transform noteNode types
  const noteNodes = nodes.filter(node => node.type === 'noteNode').map(node => {
    const { text, x, y, width, height, ...rest } = node;
    const newData = { ...rest.data, text }; // Include text under data

    // Prepare the transformed node object
    const transformedNode = { ...rest, position: {x, y}, data: newData };

    // Include width and height directly under the node if they are not null
    
    if (width != null && height != null) {
      const newStyle = {};
      newStyle.height = height;
      newStyle.width = width;
      transformedNode.style = newStyle;
      transformedNode.data.previousHeight = height;
      transformedNode.data.previousWidth = width;
    }
    return transformedNode;
  });

  // Map of tableId to table data
  const tableMap = tables.reduce((acc, table) => {
      acc[table.id] = table;
      return acc;
  }, {});

  // Update nodes with table data and consolidate x and y into position, exclude certain attributes
  let updatedNodes = tableNodes.map(({ active, tableId, x, y, ...rest }) => {
      return {
          ...rest,
          //type: 'tableNode',
          data: tableMap[tableId],
          position: { x, y }
      };
  });

  // Create edges array from relationships
  const edges = relationships.map(rel => {
      const parentTable = tables.find(table => table.columns.some(col => col.id === rel.parentColumn));
      const childTable = tables.find(table => table.columns.some(col => col.id === rel.childColumn));
      const parentNode = updatedNodes.find(node => node.data.id === parentTable.id);
      const childNode = updatedNodes.find(node => node.data.id === childTable.id);

      return {
          id: rel.id,
          source: parentNode.id,
          target: childNode.id,
          data: rel,
          type: 'floating',
          markerEnd: 'endMarker',
          markerStart: 'startMarker'
      };
  });

  updatedNodes = [...updatedNodes, ...noteNodes];

  return { updatedNodes, edges };
}

import {apiUrl} from '../config/UrlConfig.jsx'


const VersionHistoryPage = () => {
  const {id} = useParams();
  const {user, logout, getAccessTokenSilently} = useAuth0();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectName, setProjectName] = useState("");
  const previousProjectNameRef = useRef();
  const previousProjectDescriptionRef = useRef();
  const [dbTechnology, setDbTechnology] = useState(0);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCreatorName, setProjectCreatorName] = useState("");
  const [lastChange, setLastChange] = useState(null);

  const nodeTypes = useMemo(() => ({tableNode: TableNode, noteNode: NoteNode }), []);
  const edgeTypes = useMemo(() => ({floating: FloatingEdge,}), []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Helper functions
  async function updateRequest(path, payload, update_lastchange = true) {
    try {
        console.log(update_lastchange);
        const token = await getAccessTokenSilently();
        const response = await axios.patch(`${apiUrl}/${path}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (update_lastchange) {
            console.log('Updating state with new change info.')
            setLastChange({
                'projectId': id,
                'id': payload.changeId,
                'timestamp': getCurrentIsoTime()
            });
        }

        return response;
    } catch (error) {
        console.error("Error updating data", error);
        throw error;
    }
}

  // Interactivity
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  
  useEffect(() => {
    const fetchProject = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${apiUrl}/projects/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const project = await response.data;
              //const nodesAndEdges = getNodesAndEdges(project.tables, project.nodes, project.relationships)
              const nodesAndEdges = readyNodesAndEdges(project);
              setProjectName(project.name);
              previousProjectNameRef.current = project.name;
              setProjectDescription(project.description);
              previousProjectDescriptionRef.current = project.description;
              setProjectCreatorName(project.owner.name);
              console.log(project.lastChange)
              setLastChange(project.lastChange);
              setNodes(nodesAndEdges.updatedNodes);
              setEdges(nodesAndEdges.edges);
              setDbTechnology(project.dbTechnology);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    };
    fetchProject();
}, [id]);

  return (
    <>
    <svg id="endMarkerParent" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
            <marker
            id="endMarker"
            viewBox="0 0 20 20"
            markerHeight={20} 
            markerWidth={20}
            refX={20}
            refY={10}
            orient="auto"
            >
                <path d="M0,0v20" fill="none" stroke="#AAA" strokeWidth="2"/>
                <path d="M0,10L20,0" fill="none" stroke="#AAA" strokeWidth="1"/>
                <path d="M0,10L20,20" fill="none" stroke="#AAA" strokeWidth="1"/>
            </marker>
        </defs>
    </svg>
    <svg id="startMarkerParent" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
            <marker
            id="startMarker"
            viewBox="0 0 20 20"
            markerHeight={20} 
            markerWidth={20}
            refX={-3}
            refY={10}
            orient="auto"
            >
              <path d="M10,0v20" fill="none" stroke="#AAA" strokeWidth="1.5"/>
            </marker>
        </defs>
    </svg>    

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <ReactFlowProvider>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={openDrawer}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <TreeNavigator  tableList={nodes} sx={{ flexGrow: 1, overflow: 'auto' }} />
              <Divider />
              <Box sx={{ height: '105px' }}> {/* Fixed height */}
                <UserAvatar 
                  user={user}
                  onLogout={logout}
                  layoutType = "ProjectPage"
                />
              </Box>
            </Box>
          </Drawer>
          <Main open={openDrawer} sx={{p:0}}>
              {lastChange && <Flow
                nodes = {nodes}
                edges = {edges}
                onConnect = {null}
                onEdgesChange = {null}
                onNodesChange = {null}
                onAddTable = {null}
                onAddNote = {null}
                onAddTableWithAI = {null}
                handleDrawerOpen = {handleDrawerOpen}
                openDrawer = {openDrawer} 
                onEditTable = {null}
                onDeleteTable = {null}
                onDeleteRelationship = {null}
                nodeTypes = {nodeTypes}
                edgeTypes = {edgeTypes}
                connectionLineComponent = {FloatingConnectionLine}
                onNodeDragStop = {null}
                onNodeDragStart = {null}
                projectId = {id}
                projectName = {projectName}
                projectDescription = {projectDescription}
                onProjectNameChange = {null}
                onProjectNameBlur = {null}
                onProjectDescriptionChange = {null}
                onProjectDescriptionBlur = {null}
                lastChange = {lastChange}

                projectCreatorName = {user.name}
                dbTechnology={dbTechnology}
                undo = {null}
                undoStack = {null}
                onSubmitChangeName = {null}
                isVersionHistory = {true}
              />}
          </Main>
          <Box id="versionHistoryTree" sx={{ display: 'flex', flexDirection: 'column', width: versionDrawerWidth}}>
              <TreeVersionHistory  tableList={nodes} sx={{ flexGrow: 1, overflow: 'auto' }} />
            </Box>
        </ReactFlowProvider>
    </Box>
    </>
  );
};

export default withAuthenticationRequired(VersionHistoryPage, {
  onRedirecting: () => <LoadingPage />
});