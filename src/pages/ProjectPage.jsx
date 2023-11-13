import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { nanoid } from 'nanoid';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import {useNodesState, useEdgesState, addEdge} from 'reactflow';

import Flow from '../components/Flow.jsx';
import EditableTitle from '../components/EditableTitle.jsx';
import TreeNavigator from '../components/TreeNavigator.jsx';
import TableNode from '../components/TableNode.jsx';
import TableEditor from '../components/TableEditor.jsx'

import UserAvatar from '../components/UserAvatar.jsx';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingPage from './LoadingPage.jsx';

import 'reactflow/dist/style.css';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const ProjectPage = () => {
  const { user, logout } = useAuth0();
  // ReactFlow
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [idCount, setIdCount] = useState(1);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);
  const [activeTable, setActiveTable] = useState(null);


  //Page Handling
  const [projectName, setProjectName] = useState("Project Name");

  //Handlers
  const handleAddTable = () => {
    let id = idCount;
    setIdCount(id+1);
    const newNode = {
      id:nanoid(),
      type: 'tableNode',
      // we are removing the half of the node width (75) to center the new node
      position: {x:0, y:0},
      data:{
        label: 'Table ' +  id.toString(),
        columns: [{id: nanoid(), name:'col1', dataType:'Varchar', primaryKey:true, description: 'Short'}]
      }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleEditTable = (nodeId) =>{
    //const node = getNode(nodeId);
    const node = nodes.filter((n) => {return n.id === nodeId})[0];
    setActiveTable(node);
  };

  const handleDeleteTable = (nodeId) =>{
    console.log(nodeId);
    alert('Deleting Table');
  };

  const handleTableEditorCancel = () => {
    setActiveTable(null);
  };

  const handleTableEditorDone = (data) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === activeTable.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = data;
        }
        return node;
      }
    )
  );
    setActiveTable(null);
  };
  

  // Interactivity
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const updateProjectName = (e) => {
    setProjectName(e.target.value);
  };

  // The followign can be enabled once the rest api is up and running
  /*
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://api.example.com/projects/${id}`); // Replace with your API
      setProject(result.data);
    };

    fetchData();
  }, [id]);
  */


  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={openDrawer} sx={{paddingRight:5}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{width:'100%'}}>
            <EditableTitle value={projectName} onChange={updateProjectName}/>
          </Box>
          <UserAvatar user={user} onLogout={logout} />   
        </Toolbar>
      </AppBar>
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
        <TreeNavigator tableList={nodes}/>
      </Drawer>
      <Main open={openDrawer} sx={{p:1}}>
        <DrawerHeader />
        <Flow
          nodes = {nodes}
          edges = {edges}
          onConnect = {onConnect}
          onEdgesChange = {onEdgesChange}
          onNodesChange = {onNodesChange}
          onAddTable = {handleAddTable}
          onEditTable = {handleEditTable}
          onDeleteTable = {handleDeleteTable}
          nodeTypes = {nodeTypes}
        />
      </Main>
    </Box>
    {activeTable && <TableEditor table={activeTable} onCancel={handleTableEditorCancel} onDone={handleTableEditorDone}/>}
    </>
  );
};

export default withAuthenticationRequired(ProjectPage, {
  onRedirecting: () => <LoadingPage />
});
