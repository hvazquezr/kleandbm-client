import React, { useState, useCallback, useMemo, useEffect } from 'react';
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


import {
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';

import Flow from '../components/Flow.jsx';
import EditableTitle from '../components/EditableTitle.jsx';
import TreeNavigator from '../components/TreeNavigator.jsx';
import TableNode from '../components/TableNode.jsx';
import TableEditor from '../components/TableEditor.jsx';

import FloatingEdge from '../components/FloatingEdge.jsx';
import FloatingConnectionLine from '../components/FloatingConnectionLine.jsx';

import UserAvatar from '../components/UserAvatar.jsx';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingPage from './LoadingPage.jsx';

import 'reactflow/dist/style.css';
import DeleteConfirm from '../components/DeleteConfirm.jsx';

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


function readyNodesAndEdges(jsonData) {
  // Destructure the jsonData
  const { tables, relationships, nodes } = jsonData;

  // Map of tableId to table data
  const tableMap = tables.reduce((acc, table) => {
      acc[table.id] = table;
      return acc;
  }, {});

  // Update nodes with table data and consolidate x and y into position, exclude certain attributes
  const updatedNodes = nodes.map(({ active, tableId, x, y, ...rest }) => {
      return {
          ...rest,
          type: 'tableNode',
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

  return { updatedNodes, edges };
}


const ProjectPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectName, setProjectName] = useState("");
  const [dbTechnology, setDbTechnology] = useState(0);
  const [activeTable, setActiveTable] = useState(null);
  const [toDeleteNode, setToDeleteNode] = useState(null);
  const {id} = useParams();
  //console.log({id});

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'floating', markerEnd: 'endMarker', markerStart: 'startMarker' }, eds)
      ),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({tableNode: TableNode }), []);
  const edgeTypes = useMemo(() => ({floating: FloatingEdge,}), []);
  

  async function updateRequest(path, payload) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch('http://127.0.0.1:5000/api/v1/' + path, payload, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          });
          return response;
    } catch (error) {
      console.error("Error updataing data", error);
      throw error;
    }
  }

  async function deleteRequest(path) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.delete('http://127.0.0.1:5000/api/v1/' + path, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          });
          return response;
    } catch (error) {
      console.error("Error deleting data", error);
      throw error;
    }
  }


  //Handlers
  const handleAddTable = () => {
    const newNode = {
      id:nanoid(),
      new:true,
      type: 'tableNode',
      position: {x:0, y:0},
      active: true,
      project_id: id,
      data:{
        id: nanoid(),
        project_id: id,
        name: 'New Table',
        columns: [],
        active: true,
        description: ''
      }
    };
    //setNodes((nds) => nds.concat(newNode));
    setActiveTable(newNode);
  };

  const handleEditTable = (id) =>{
    //const node = getNode(nodeId);
    const node = nodes.filter((n) => {return n.id === id})[0];
    setActiveTable(node);
  };

  const handleDeleteTable = (id) =>{
    const node = nodes.filter((n) => {return n.id === id})[0];
    setToDeleteNode(node);
  };

  const handleConfirmDeleteNode = (nodeToDelete) =>{
    const nodeId = nodeToDelete.id
    deleteRequest(`projects/${id}/nodes/${nodeId}`);
    deleteRequest(`projects/${id}/tables/${nodeToDelete.tableId}`);

    setNodes((nds) => nds.filter((node) => node.id !== nodeId));

    // If you also want to remove edges connected to this node
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  
    setToDeleteNode(null);
  };

  const handleCancelDeleteNode = () =>{
    setToDeleteNode(null);
  };

  const handleTableEditorCancel = () => {
    setActiveTable(null);
  };

  const handleTableEditorDone = (data) => {
    // Save node
    const readyNode = {
      id: activeTable.id, 
      tableId: activeTable.data.id, 
      project_id: activeTable.project_id,
      x: activeTable.position.x,
      y: activeTable.position.y,
      active: true
    }
    updateRequest(`projects/${id}/nodes/${activeTable.id}`, readyNode);

    // save table
    const readyTable = activeTable.data;
    readyTable.name = data.name;
    readyTable.columns = data.columns;
    readyTable.description = data.description;
    updateRequest(`projects/${id}/tables/${activeTable.data.id}`, readyTable);

    // updating node in array
    if (activeTable.new){
      setNodes((nds) => nds.concat(activeTable));
    }
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

  const saveProjectName = async (e) => {
    const newName = {name: e.target.value};
    updateRequest(`projects/${id}`, newName);
  };

  const onNodeDragStop = useCallback(async (event, node) => {
    updateRequest(`projects/${id}/nodes/${node.id}`, node.position);
  }, []);
  
  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`http://127.0.0.1:5000/api/v1/projects/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const project = await response.data;
              //const nodesAndEdges = getNodesAndEdges(project.tables, project.nodes, project.relationships)
              const nodesAndEdges = readyNodesAndEdges(project);
              setProjectName(project.name);
              setNodes(nodesAndEdges.updatedNodes);
              setEdges(nodesAndEdges.edges);
              setDbTechnology(project.dbTechnology);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };
    fetchProjects();
}, [id]);

  return (
    <>
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
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
                <path d="M0,0v20" fill="none" stroke="#cccccc" strokeWidth="2"/>
                <path d="M0,10L20,0" fill="none" stroke="#cccccc" strokeWidth="1"/>
                <path d="M0,10L20,20" fill="none" stroke="#cccccc" strokeWidth="1"/>
            </marker>
        </defs>
    </svg>
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
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
              <path d="M10,0v20" fill="none" stroke="#cccccc" strokeWidth="1.5"/>
            </marker>
        </defs>
    </svg>    

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
            <EditableTitle value={projectName} onChange={updateProjectName} onBlur={saveProjectName}/>
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
          edgeTypes = {edgeTypes}
          connectionLineComponent = {FloatingConnectionLine}
          onNodeDragStop = {onNodeDragStop}
        />
      </Main>
    </Box>
    {activeTable && <TableEditor 
                      table={activeTable}
                      dbTechnology={dbTechnology}
                      onCancel={handleTableEditorCancel}
                      onDone={handleTableEditorDone}/>}
    {toDeleteNode && <DeleteConfirm
                      node={toDeleteNode}
                      onConfirm={handleConfirmDeleteNode}
                      onCancel={handleCancelDeleteNode}/>}
    </>
  );
};

export default withAuthenticationRequired(ProjectPage, {
  onRedirecting: () => <LoadingPage />
});
