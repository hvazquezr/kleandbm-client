import React, {useCallback, useState, useRef, useEffect} from 'react';
import ReactFlow, { 
  MiniMap,
  Controls,
  Panel,
  useKeyPress} from 'reactflow';
import TableContextMenu from './TableContextMenu';
import RelationshipContextMenu from './RelationshipContextMenu';
import PaneContextMenu from './PaneContextMenu';
import ProjectInformation from './ProjectInformationAlternate';
import DrawerControl from './DrawerControl';

const proOptions = { hideAttribution: true };

export default function Flow({
  nodes,
  edges,
  onConnect,
  onEdgesChange,
  onNodesChange,
  onAddTable,
  onAddNote,
  onAddTableWithAI,
  handleDrawerOpen,
  openDrawer, 
  onEditTable,
  onDeleteTable,
  onDeleteRelationship,
  nodeTypes,
  edgeTypes,
  connectionLineComponent,
  onNodeDragStop,
  onNodeDragStart,
  projectId,
  projectName,
  onProjectNameChange,
  onProjectNameBlur,
  projectDescription,
  onProjectDescriptionChange,
  onProjectDescriptionBlur,
  lastModified,
  projectCreatorName,
  dbTechnology,
  undo,
  undoStack
}) {

  const [paneMenu, setPaneMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [edgeMenu, setEdgeMenu] = useState(null);
  const deletePressed = useKeyPress(['Delete', 'Backspace']) 
  const ref = useRef(null);

  useEffect(() => {
    // This is only preventing being able to delete using Delete key
    //alert('Trying to detete');
  }, [deletePressed])

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      setNodeMenu({
        id: node.id,
        type: node.type,
        top: event.clientY,
        left: event.clientX});
    },
    [setNodeMenu],
  );

  const onPaneContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();

      setPaneMenu({
        top: event.clientY,
        left: event.clientX,
        pane});
    },
    [setPaneMenu],
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      // Prevent native context menu from showing
      event.preventDefault();

      setEdgeMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX});
    },
    [setEdgeMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {setPaneMenu(null), setNodeMenu(null), setEdgeMenu(null)}, [setPaneMenu, setNodeMenu, setEdgeMenu]);

  return (
    <div className='kalmdbm'>
        <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        fitView
        minZoom = {.3}
        onConnect={onConnect}
        onEdgesChange = {onEdgesChange}
        onNodesChange = {onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent = {connectionLineComponent}
        proOptions={proOptions}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onNodeDragStart={onNodeDragStart}
        deleteKeyCode={[]} // This is done to prvent deleting objects by pressing the delete key
        >
            <Panel position="top-left">
              <DrawerControl
                handleDrawerOpen = {handleDrawerOpen}
                openDrawer = {openDrawer} 
              />
            </Panel>
            <Panel position="top-right">
              <ProjectInformation
                projectId = {projectId}
                projectName = {projectName} 
                onProjectNameChange = {onProjectNameChange}
                onProjectNameBlur = {onProjectNameBlur}
                projectDescription = {projectDescription}
                onProjectDescriptionChange = {onProjectDescriptionChange}
                onProjectDescriptionBlur = {onProjectDescriptionBlur}
                lastModified = {lastModified}
                projectCreatorName = {projectCreatorName}
                dbTechnology={dbTechnology}
              />
            </Panel>
            <Controls />
            <MiniMap pannable = 'true' zoomable = 'true' />
            {paneMenu && <PaneContextMenu 
              onClick={onPaneClick}
              menuOptions={paneMenu}
              onAddTable={onAddTable}
              onAddTableWithAI={onAddTableWithAI}
              onAddNote={onAddNote}
              undo = {undo}
              undoStack = {undoStack}
            />}
            {nodeMenu && <TableContextMenu onClick={onPaneClick} menuOptions={nodeMenu} onDeleteTable={onDeleteTable} onEditTable={onEditTable}/>}
            {edgeMenu && <RelationshipContextMenu onClick={onPaneClick} menuOptions={edgeMenu} onDeleteRelationship={onDeleteRelationship}/>}
        </ReactFlow>
    </div>
  );
}