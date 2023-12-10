import React, {useCallback, useState, useRef} from 'react';
import ReactFlow, { 
  MiniMap,
  Controls,
  Panel } from 'reactflow';
import ActionMenu from './ActionMenu';
import TableContextMenu from './TableContextMenu';



const proOptions = { hideAttribution: true };


export default function Flow({nodes, edges, onConnect, onNodesChange, onEdgesChange, onAddTable, onEditTable, onDeleteTable, nodeTypes, edgeTypes, connectionLineComponent}) {

  const [menu, setMenu] = useState(null);
  const ref = useRef(null);



  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 100 && event.clientY,
        left: event.clientX < pane.width - 100 && event.clientX});
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);


  /* TODO:
    Incorporate ability to define/edit fields for a table
  */
  return (
    <div style={{ width: `calc(100vw - 30px)`, height: `calc(100vh - 80px)` }}>
        <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent = {connectionLineComponent}
        proOptions={proOptions}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
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