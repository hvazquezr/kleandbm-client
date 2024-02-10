import React, { useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { nanoid } from 'nanoid';
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
  addEdge,
  ReactFlowProvider
} from 'reactflow';

import Flow from '../components/Flow';
import TreeNavigator from '../components/TreeNavigator';
import TableNode from '../components/TableNode';
import TableEditor from '../components/TableEditor';
import DeleteConfirm from '../components/DeleteConfirm';
import FloatingEdge from '../components/FloatingEdge';
import FloatingConnectionLine from '../components/FloatingConnectionLine';
import Warning from '../components/Warning';
import AITableCreator from '../components/aITableCreator.jsx';
import UserAvatar from '../components/UserAvatar.jsx';

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
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    width: '100vw',
    ...(open && {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: `calc(100vw - ${drawerWidth}px)`,
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

import {apiUrl} from '../config/UrlConfig.jsx'


const ProjectPage = () => {
  const {id} = useParams();
  const {user, logout, getAccessTokenSilently} = useAuth0();
  const [undoStack, setUndoStack] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectName, setProjectName] = useState("");
  const [previousProjectName, setPreviousProjectName] = useState("");
  const [dbTechnology, setDbTechnology] = useState(0);
  const [activeTable, setActiveTable] = useState(null);
  const [toDeleteTable, setToDeleteTable] = useState(null);
  const [toDeleteRelationship, setToDeleteRelationship] = useState(null);
  const [warningMessage, setWarningMessage]= useState(null);
  const [previousProjectDescription, setPreviousProjectDescription] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCreatorName, setProjectCreatorName] = useState("");
  const [lastModified, setLastModified] = useState(null);
  const [showAITableCreator, setShowAITableCreator] = useState(false);
  const [paneContextMenuPosition, setPaneContextMenuPosition] = useState(null);
  const [isCompleteAITable, setIsCompleteAITable] = useState(false);

  const nodeTypes = useMemo(() => ({tableNode: TableNode }), []);
  const edgeTypes = useMemo(() => ({floating: FloatingEdge,}), []);

  const undo = () => {
    const lastOperation = undoStack.pop();
    setUndoStack([...undoStack]); // Update the undoStack state
    if (lastOperation) {
      lastOperation();
    }
  };

  const addToUndoStack = (operation) => {
    console.log('adding:');
    console.log(operation);
    setUndoStack((prevStack) => [...prevStack, operation]);
  };
  
  //Helper functions
  async function updateRequest(path, payload) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch(`${apiUrl}/`+ path, payload, {
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
      const response = await axios.delete(`${apiUrl}/` + path, {
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
      (params, addUndo = true) => {
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
        if (addUndo){
          addToUndoStack(() => deleteRelationship(newRelationship, true, false));
        }
      }
      else{
        setWarningMessage(<div><strong>{parentTable.name}</strong> does not have a primary key.</div>);
      }
    }, [nodes, setEdges]
  );

  async function undoAIRecommendations(nodesToUndo, edgesToUndo){
    nodesToUndo.forEach(n => {handleConfirmDeleteNode(n)});
    edgesToUndo.forEach(r => {deleteRelationship(r, false, false)});
  };

  //Handlers

  async function handleAITableCreatorDone(instructions) {
    try {
        const token = await getAccessTokenSilently();
        console.log(paneContextMenuPosition);

        // Initial request to start the job and get jobId
        const startResponse = await axios.post(`${apiUrl}/projects/${id}/aisuggestedtables`, { prompt: instructions, position: paneContextMenuPosition }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const jobId = startResponse.data.jobId; // Assuming jobId is returned

        const pollJobStatus = async () => {
            try {
                // Polling the status of the job
                const statusResponse = await axios.get(`${apiUrl}/jobs/${jobId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (statusResponse.data && statusResponse.data.result !== null) {
                    clearInterval(pollingInterval);

                    const recommendations = statusResponse.data.result;
                    if (recommendations.newNodes.length > 0){
                      recommendations.newNodes.forEach(n => {n.type='tableNode'; updateNode(n, true)});
                      
                      // Because state does not get refreshed right away addRelationship cannot be used.
                      // The relationships will be added here
                      //recommendations.newEdges.forEach(e => addRelationship(e, false));
                      for (const e of recommendations.newEdges) {
                        console.log(e);
                        updateRequest(`projects/${id}/relationships/${e.data.id}`, e.data);
                        setEdges((eds) => addEdge(e, eds));
                      }
                      //setIsCompleteAITable(true);

                      addToUndoStack(() => undoAIRecommendations(recommendations.newNodes, recommendations.newEdges));
                      setShowAITableCreator(false);
                    }
                    else {
                      setWarningMessage("The instruction did not generate any new tables.");
                      setShowAITableCreator(false);
                    }
                }
            } catch (pollError) {
                console.error("Error polling job status", pollError);
                clearInterval(pollingInterval);
                setShowAITableCreator(false);
                throw pollError;
            }
        };

        // Start polling every 5 seconds
        const pollingInterval = setInterval(pollJobStatus, 5000);

    } catch (error) {
        console.error("Error initiating AI table creation", error);
        setShowAITableCreator(false);
        throw error;
    }
}

  // @TODO: Handle the position of the click to position the new tables.
  const handleAddTableWithAI = (position) => {
    setPaneContextMenuPosition(position);
    setShowAITableCreator(true);
  }

  const handleAddTable = (position={x:600, y:80}) => {
    const newNode = {
      id:nanoid(),
      new:true,
      type: 'tableNode',
      position,
      active: true,
      projectId: id,
      data:{
        id: nanoid(),
        projectId: id,
        name: 'New Table',
        columns: [],
        active: true,
        description: ''
      }
    };
    setActiveTable(newNode);
  };

  const handleEditTable = (id) =>{
    //const node = getNode(nodeId);
    const node = deepCopyObject(nodes.filter((n) => {return n.id === id})[0]);
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
    relatedRelationships.forEach(e => deleteRelationship(e, (e.source === nodeToDelete.id), false));

    deleteRequest(`projects/${id}/tables/${nodeToDelete.data.id}`);
    deleteRequest(`projects/${id}/nodes/${nodeId}`);

    //Delete node from UI
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  
    setToDeleteTable(null);
  };

  const undoDeleteNode = async (node, relationships) => {
    // Restablish node
    node.new = true;
    updateNode(node, true);
    relationships.forEach(r => addRelationship(r, false));
  };


  const updateNode = async (node, isNew = false) => {
    console.log('Calling updateNode');
    // Cleaning copy of the node
    const copyNode = {
      id: node.id, 
      tableId: node.data.id, 
      projectId: id,
      x: node.position.x,
      y: node.position.y,
      active: true
    }
    
    updateRequest(`projects/${id}/nodes/${node.id}`, copyNode),
    updateRequest(`projects/${id}/tables/${node.data.id}`, node.data)

    // Adding node in array if new
    if (isNew || node.new){
      delete node.new;
      const newN = deepCopyObject(node);
      setNodes((nds) => nds.concat(newN));
      // undo is to call handleConfirmDeleteNode with newN
    }
    else{
      // Updating in Flow
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            // undo is to call updateNode with n before it's modified
            n = deepCopyObject(node);
          }
          return n;
        }
      ));
    }
    setActiveTable(null);
  };

  const handleConfirmDeleteNodeWithUndo = async (node) => {
    const relatedRelationships = edges.filter((edge) => edge.source === node.id || edge.target === node.id);
    const nodeCopy = deepCopyObject(node);
    addToUndoStack(() => undoDeleteNode(nodeCopy, relatedRelationships));
    //addToUndoStack(() => {console.log('hello1'); updateNode(node, true); console.log('hello2');{relatedRelationships.forEach(r => addRelationship(r, false))};});
    handleConfirmDeleteNode(node);
  };

  const updateNodeWithUndo = async (node, isNew = false) => {
    console.log('Calling updateNodeWithUndo');
    let oldNode = null;
    if (isNew || node.new){
      // If it's new the undo action is to delete it
      addToUndoStack(() => handleConfirmDeleteNode(node))
    }
    else{
      // If it's an update find the current element and send it to to the undo stack
      console.log(nodes);
      nodes.forEach(n => {
        if (n.id === node.id) {
          console.log(n);
          oldNode = deepCopyObject(n);
          console.log(oldNode);
          addToUndoStack(() => updateNode(oldNode));
        }
      });      
    }
    // Perform normal operaion after so that the previous node state can be saved before it's modified
    updateNode(node, isNew);
  };

  const handleDeleteRelationship = (id) => {
    const edge = edges.filter((e) => {return e.id === id})[0];
    console.log(edge);
    setToDeleteRelationship(edge);
  }

  const deleteRelationship = (relationshipToDelete, shouldUpdateNode = true, addUndo = true) => {

    if (shouldUpdateNode) {
      const targetNode = nodes.filter((n) => {return n.id === relationshipToDelete.target})[0];
      targetNode.data.columns = (targetNode.data.columns).filter(column => column.id !== relationshipToDelete.data.childColumn);
      updateNode(targetNode);
    }
    deleteRequest(`projects/${id}/relationships/${relationshipToDelete.id}`);

    // Deleting actual edge from UI
    setEdges((es) => es.filter((e) => e.id !== relationshipToDelete.id));
    setToDeleteRelationship(null);
    if (addUndo){
      addToUndoStack(() => addRelationship({target: relationshipToDelete.target, source:relationshipToDelete.source}, addUndo=false))
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

  const updateProjectName = (e) => {
    setProjectName(e.target.value);
  };

  const saveProjectName = async (e) => {
    const newName = {name: e.target.value};
    updateRequest(`projects/${id}`, newName);
    addToUndoStack(() => {updateRequest(`projects/${id}`, {name: previousProjectName}); setProjectName(previousProjectName);})
    setPreviousProjectName(newName.name);
  };

  const updateProjecDescription = (e) => {
    setProjectDescription(e.target.value);
  };

  const saveProjectDescription = async (e) => {
    const newDescription = {description: e.target.value};
    updateRequest(`projects/${id}`, newDescription);
    addToUndoStack(() => {updateRequest(`projects/${id}`, {description: previousProjectDescription}); setProjectDescription(previousProjectDescription);});
    setPreviousProjectDescription(newDescription.description);
  };

  const onNodeDragStop = useCallback(async (event, node) => {
    updateRequest(`projects/${id}/nodes/${node.id}`, node.position);
    addToUndoStack(() => {undoNodeDrag(node.id, node.data.oldPosition)});
  }, []);

  const undoNodeDrag = async (nodeId, position) => {
    updateRequest(`projects/${id}/nodes/${nodeId}`, position);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          n = deepCopyObject(n);
          n.position = position;
        }
        return n;
      }
    ));    
  }

  const onNodeDragStart = useCallback(async (event, node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          n = deepCopyObject(node);
          n.data.oldPosition = n.position;
        }
        return n;
      }
    ));
  }, []);
  
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
              setPreviousProjectName(project.name);
              setProjectDescription(project.description);
              setPreviousProjectDescription(project.description);
              setProjectCreatorName(project.owner.name);
              setLastModified(project.lastModified);
              setNodes(nodesAndEdges.updatedNodes);
              setEdges(nodesAndEdges.edges);
              setDbTechnology(project.dbTechnology);
        } catch (error) {
            console.error("Error fetching project", error);
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
              <Box sx={{ height: '150px' }}> {/* Fixed height */}
                <UserAvatar 
                  user={user}
                  onLogout={logout}
                  layoutType = "ProjectPage"
                />
              </Box>
            </Box>
          </Drawer>
          <Main open={openDrawer} sx={{p:0}}>
            <Flow
              nodes = {nodes}
              edges = {edges}
              onConnect = {addRelationship}
              onEdgesChange = {onEdgesChange}
              onNodesChange = {onNodesChange}
              onAddTable = {handleAddTable}
              onAddTableWithAI = {handleAddTableWithAI}
              handleDrawerOpen = {handleDrawerOpen}
              openDrawer = {openDrawer} 
              onEditTable = {handleEditTable}
              onDeleteTable = {handleDeleteTable}
              onDeleteRelationship = {handleDeleteRelationship}
              nodeTypes = {nodeTypes}
              edgeTypes = {edgeTypes}
              connectionLineComponent = {FloatingConnectionLine}
              onNodeDragStop = {onNodeDragStop}
              onNodeDragStart = {onNodeDragStart}
              projectId = {id}
              projectName = {projectName}
              projectDescription = {projectDescription}
              onProjectNameChange = {updateProjectName}
              onProjectNameBlur = {saveProjectName}
              onProjectDescriptionChange = {updateProjecDescription}
              onProjectDescriptionBlur = {saveProjectDescription}
              lastModified = {lastModified}
              projectCreatorName = {projectCreatorName}
              dbTechnology={dbTechnology}
              undo = {undo}
              undoStack = {undoStack}
            />
          </Main>
        </ReactFlowProvider>
    </Box>
    <Warning message={warningMessage} closeWarning={() => {setWarningMessage(null)}} />
    {activeTable && <TableEditor
                      node={activeTable}
                      projectId={id}
                      dbTechnologyId={dbTechnology}
                      onCancel={() => {setActiveTable(null)}}
                      onDone={updateNodeWithUndo}
                      />}
    {toDeleteTable && <DeleteConfirm
                      type='table' 
                      object={toDeleteTable}
                      onConfirm={handleConfirmDeleteNodeWithUndo}
                      onCancel={() => {setToDeleteTable(null)}}
                      />}
    {toDeleteRelationship && <DeleteConfirm
                      type='relationship' 
                      object={toDeleteRelationship}
                      onConfirm={deleteRelationship}
                      onCancel={() => {setToDeleteRelationship(null)}}
                      nodes = {nodes}
                      />}
    {showAITableCreator && <AITableCreator
                      projectId = {id}
                      onDone =  {handleAITableCreatorDone} // Placeholder
                      onCancel= {() => {setShowAITableCreator(false)}}
                      isComplete={isCompleteAITable}
                      />}
    </>
  );
};

export default withAuthenticationRequired(ProjectPage, {
  onRedirecting: () => <LoadingPage />
});
