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

import Flow from '../components/Flow';
import EditableTitle from '../components/EditableTitle';
import TreeNavigator from '../components/TreeNavigator';
import TableNode from '../components/TableNode';
import TableEditor from '../components/TableEditor';
import DeleteConfirm from '../components/DeleteConfirm';
import FloatingEdge from '../components/FloatingEdge';
import FloatingConnectionLine from '../components/FloatingConnectionLine';
import UserAvatar from '../components/UserAvatar';
import Warning from '../components/Warning';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import LoadingPage from './LoadingPage.jsx';

import 'reactflow/dist/style.css';
import '../components/css/kalmdbm.css';
import { deepCopyObject, getCurrentUnixTime} from '../components/utils.jsx';

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
  const {id} = useParams();
  const {user, logout, getAccessTokenSilently} = useAuth0();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectName, setProjectName] = useState("");
  const [dbTechnology, setDbTechnology] = useState(0);
  const [activeTable, setActiveTable] = useState(null);
  const [toDeleteTable, setToDeleteTable] = useState(null);
  const [toDeleteRelationship, setToDeleteRelationship] = useState(null);
  const [warningMessage, setWarningMessage]= useState(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCreatorName, setProjectCreatorName] = useState("");
  const [lastModified, setLastModified] = useState(null);

  const nodeTypes = useMemo(() => ({tableNode: TableNode }), []);
  const edgeTypes = useMemo(() => ({floating: FloatingEdge,}), []);
  
  //Helper functions
  async function updateRequest(path, payload) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch('http://127.0.0.1:5000/api/v1/' + path, payload, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          });
          setLastModified(getCurrentUnixTime());
          return response;
    } catch (error) {
      console.error("Error updataing data", error);
      throw error;
    }
  };

  async function deleteRequest(path) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.delete('http://127.0.0.1:5000/api/v1/' + path, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          });
          setLastModified(getCurrentUnixTime());
          return response;
    } catch (error) {
      console.error("Error deleting data", error);
      throw error;
    }
  };

  const addRelationship = useCallback(
      (params) => {
      // Retrieve columns of source node
      const parentTable = (nodes.filter((n) => n.id === params.source)[0]).data;
      const childNode = (nodes.filter((n) => n.id === params.target)[0]);
      const pkColumns = (parentTable.columns).filter((c) => c.primaryKey);
      // Making sure the source table has at least one pk
      if (pkColumns.length > 0){
        const pkColumn = pkColumns[0]; //@TODO: For now it only supports one primary key
        const newChildColumn = {
                                id:nanoid(),
                                name: pkColumn.name, //@TODO: Need to validate to when name already exists
                                dataType: pkColumn.dataType,
                                description: 'Foreign Key to ' + parentTable.name,
                                primaryKey: false //@TODO: Needs to revisit when implemeting identifying relationsihps
        };
        childNode.data.columns = childNode.data.columns.concat(newChildColumn);
        updateNode(childNode);
        const newRelationship = { ...params, id: nanoid(), type: 'floating', markerEnd: 'endMarker', markerStart: 'startMarker' };
        newRelationship.data =  {
                                  id:newRelationship.id,
                                  identifying: false, //eventually we'll need to revisit this to support identifying relationships
                                  label: null,
                                  projectId: id,
                                  active: true,
                                  parentColumn: pkColumn.id,
                                  childColumn: newChildColumn.id
                                }
        updateRequest(`projects/${id}/relationships/${newRelationship.id}`, newRelationship.data);
        setEdges((eds) => addEdge(newRelationship, eds));
      }
      else{
        setWarningMessage(<div><strong>{parentTable.name}</strong> does not have a primary key.</div>);
      }
    }, [nodes, setEdges]
  );

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
    setToDeleteTable(node);
  };

  const handleConfirmDeleteNode = (nodeToDelete) =>{
    const nodeId = nodeToDelete.id

    // Determine relationships where the node acts a source/parent or target/child
    const relatedRelationships = edges.filter((edge) => edge.source === nodeToDelete.id || edge.target === nodeToDelete.id);

    // Iterate over the array to delete the relationsihps.
    // Only in the cases where the node is the source the child objects should be updated
    relatedRelationships.forEach(e => deleteRelationship(e, (e.source === nodeToDelete.id)));

    deleteRequest(`projects/${id}/tables/${nodeToDelete.data.id}`);
    deleteRequest(`projects/${id}/nodes/${nodeId}`);

    //Delete node from UI
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  
    setToDeleteTable(null);
  };

  const updateNode = (node) => {
    // Cleaning copy of the node
    const copyNode = {
      id: node.id, 
      tableId: node.data.id, 
      project_id: id,
      x: node.position.x,
      y: node.position.y,
      active: true
    }
    
    // Persisting changes
    updateRequest(`projects/${id}/nodes/${node.id}`, copyNode);
    updateRequest(`projects/${id}/tables/${node.data.id}`, node.data);

    // Adding node in array if new
    if (node.new){
      delete node.new;
      setNodes((nds) => nds.concat(node));
    }
    else{
      // Updating in Flow
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            n = deepCopyObject(node);
          }
          return n;
        }
      ));
    }
    setActiveTable(null);
  };

  const handleDeleteRelationship = (id) => {
    const edge = edges.filter((e) => {return e.id === id})[0];
    console.log(edge);
    setToDeleteRelationship(edge);
  }

  const deleteRelationship = (relationshipToDelete, shouldUpdateNode = true) => {

    if (shouldUpdateNode) {
      const targetNode = nodes.filter((n) => {return n.id === relationshipToDelete.target})[0];
      targetNode.data.columns = (targetNode.data.columns).filter(column => column.id !== relationshipToDelete.data.childColumn);
      updateNode(targetNode);
    }
    deleteRequest(`projects/${id}/relationships/${relationshipToDelete.id}`);

    // Deleting actual edge from UI
    setEdges((es) => es.filter((e) => e.id !== relationshipToDelete.id));
    setToDeleteRelationship(null);
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

  const updateProjectName = (e) => {
    setProjectName(e.target.value);
  };

  const saveProjectName = async (e) => {
    const newName = {name: e.target.value};
    updateRequest(`projects/${id}`, newName);
  };

  const updateProjecDescription = (e) => {
    setProjectDescription(e.target.value);
  };

  const saveProjectDescription = async (e) => {
    const newName = {description: e.target.value};
    updateRequest(`projects/${id}`, newName);
  };

  const onNodeDragStop = useCallback(async (event, node) => {
    updateRequest(`projects/${id}/nodes/${node.id}`, node.position);
  }, []);
  
  useEffect(() => {
    const fetchProject = async () => {
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
              setProjectDescription(project.description);
              setProjectCreatorName(project.owner.name);
              setLastModified(project.lastModified);
              setNodes(nodesAndEdges.updatedNodes);
              setEdges(nodesAndEdges.edges);
              setDbTechnology(project.dbTechnology);
        } catch (error) {
            console.error("Error fetching projects", error);
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
      <AppBar position="fixed" open={openDrawer} sx={{paddingRight:0}}>
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
      <Main open={openDrawer} sx={{p:0}}>
        <DrawerHeader />
        <Flow
          nodes = {nodes}
          edges = {edges}
          onConnect = {addRelationship}
          onEdgesChange = {onEdgesChange}
          onNodesChange = {onNodesChange}
          onAddTable = {handleAddTable}
          onEditTable = {handleEditTable}
          onDeleteTable = {handleDeleteTable}
          onDeleteRelationship = {handleDeleteRelationship}
          nodeTypes = {nodeTypes}
          edgeTypes = {edgeTypes}
          connectionLineComponent = {FloatingConnectionLine}
          onNodeDragStop = {onNodeDragStop}
          projectName = {projectName}
          projectDescription = {projectDescription}
          onProjectDescriptionChange = {updateProjecDescription}
          onProjectDescriptionBlur = {saveProjectDescription}
          lastModified = {lastModified}
          projectCreatorName = {projectCreatorName}
        />
      </Main>
    </Box>
    <Warning message={warningMessage} closeWarning={() => {setWarningMessage(null)}} />
    {activeTable && <TableEditor
                      node={activeTable}
                      dbTechnology={dbTechnology}
                      onCancel={() => {setActiveTable(null)}}
                      onDone={updateNode}
                      />}
    {toDeleteTable && <DeleteConfirm
                      type='table' 
                      object={toDeleteTable}
                      onConfirm={handleConfirmDeleteNode}
                      onCancel={() => {setToDeleteTable(null)}}
                      />}
    {toDeleteRelationship && <DeleteConfirm
                      type='relationship' 
                      object={toDeleteRelationship}
                      onConfirm={deleteRelationship}
                      onCancel={() => {setToDeleteRelationship(null)}}
                      nodes = {nodes}
                      />}
    </>
  );
};

export default withAuthenticationRequired(ProjectPage, {
  onRedirecting: () => <LoadingPage />
});
