import React, {useCallback, useState, useRef} from 'react';
import ReactFlow, { MiniMap, Controls, Panel } from 'reactflow';
import ActionMenu from './ActionMenu';
import TableNode from './TableNode'
import TableContextMenu from './TableContextMenu';

const nodeTypes = {
  tableNode: TableNode,
};

const proOptions = { hideAttribution: true };


export default function Flow({nodes, edges, onConnect, onNodesChange, onEdgesChange, handleAddTable}) {

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
        left: event.clientX < pane.width - 100 && event.clientX      });
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);


  /* TODO:
    Incorporate ability to define/edit fields for a table
  */
  return (
    <div style={{ width: `calc(100vw - 50px)`, height: `calc(100vh - 112px)` }}>
        <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        >
            <Panel position="top-right">
                <ActionMenu 
                  handleAddTable = {handleAddTable}
                />
            </Panel>
            <Controls />
            <MiniMap pannable = 'true' zoomable = 'true' />
            {menu && <TableContextMenu onClick={onPaneClick} {...menu}/>}
        </ReactFlow>
    </div>
  );
}