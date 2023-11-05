import React, {useCallback, useState, useRef} from 'react';
import ReactFlow, { MiniMap, Controls, Panel } from 'reactflow';
import ActionMenu from './ActionMenu';
import TableNode from './TableNode'

const nodeTypes = {
  tableNode: TableNode,
};

import 'reactflow/dist/style.css';
import TableContextMenu from './TableContextMenu';

const proOptions = { hideAttribution: true };


export default function Flow({nodes, edges, onConnect, onNodesChange, onEdgesChange, handleAddTable}) {
  
  const [tableContextMenu, setTableContextMenu] = useState(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setTableContextMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setTableContextMenu],
  );

  const onPaneClick = useCallback(() => setTableContextMenu(null), [setTableContextMenu]);

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
            {tableContextMenu && <TableContextMenu onClick={onPaneClick} {...tableContextMenu} />}
        </ReactFlow>
    </div>
  );
}