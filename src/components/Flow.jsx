import React, {useCallback, useState, useRef, useEffect} from 'react';
import ReactFlow, { 
  MiniMap,
  Controls,
  Panel,
  useKeyPress} from 'reactflow';
import ActionMenu from './ActionMenu';
import TableContextMenu from './TableContextMenu';
import RelationshipContextMenu from './RelationshipContextMenu';
import ProjectInformation from './ProjectInformationAlternate';

const proOptions = { hideAttribution: true };

export default function Flow({
  nodes,
  edges,
  onConnect,
  onEdgesChange,
  onNodesChange,
  onAddTable,
  onEditTable,
  onDeleteTable,
  onDeleteRelationship,
  nodeTypes,
  edgeTypes,
  connectionLineComponent,
  onNodeDragStop,
  projectId,
  projectName,
  projectDescription,
  onProjectDescriptionChange,
  onProjectDescriptionBlur,
  lastModified,
  projectCreatorName
}) {

  const [menu, setMenu] = useState(null);
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

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX});
    },
    [setMenu],
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setEdgeMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX});
    },
    [setEdgeMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {setMenu(null), setEdgeMenu(null)}, [setMenu, setEdgeMenu]);

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
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeDragStop={onNodeDragStop}
        deleteKeyCode={[]} // This is done to prvent deleting objects by pressing the delete key
        >
            <Panel position="top-left">
              <ProjectInformation
                projectId = {projectId}
                projectName = {projectName} 
                projectDescription = {projectDescription}
                onProjectDescriptionChange = {onProjectDescriptionChange}
                onProjectDescriptionBlur = {onProjectDescriptionBlur}
                lastModified = {lastModified}
                projectCreatorName = {projectCreatorName}
              />
            </Panel>
            <Panel position="top-right">
                <ActionMenu 
                  handleAddTable = {onAddTable}
                />
            </Panel>
            <Controls />
            <MiniMap pannable = 'true' zoomable = 'true' />
            {menu && <TableContextMenu onClick={onPaneClick} menuOptions={menu} onDeleteTable={onDeleteTable} onEditTable={onEditTable}/>}
            {edgeMenu && <RelationshipContextMenu onClick={onPaneClick} menuOptions={edgeMenu} onDeleteRelationship={onDeleteRelationship}/>}
        </ReactFlow>
    </div>
  );
}