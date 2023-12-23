import React, {useCallback, useState, useRef, useEffect} from 'react';
import ReactFlow, { 
  MiniMap,
  Controls,
  Panel,
  useKeyPress} from 'reactflow';
import ActionMenu from './ActionMenu';
import TableContextMenu from './TableContextMenu';


const proOptions = { hideAttribution: true };

export default function Flow({nodes, edges, onConnect, onEdgesChange, onNodesChange, onAddTable, onEditTable, onDeleteTable, nodeTypes, edgeTypes, connectionLineComponent, onNodeDragStop}) {

  const [menu, setMenu] = useState(null);
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

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div style={{ width: `calc(100vw - 30px)`, height: `calc(100vh - 80px)` }}>
        <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        fitView
        onConnect={onConnect}
        onEdgesChange = {onEdgesChange}
        onNodesChange = {onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent = {connectionLineComponent}
        proOptions={proOptions}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        deleteKeyCode={[]}
        >
            <Panel position="top-right">
                <ActionMenu 
                  handleAddTable = {onAddTable}
                />
            </Panel>
            <Controls />
            <MiniMap pannable = 'true' zoomable = 'true' />
            {menu && <TableContextMenu onClick={onPaneClick} menuOptions={menu} onDeleteTable={onDeleteTable} onEditTable={onEditTable}/>}
        </ReactFlow>
    </div>
  );
}