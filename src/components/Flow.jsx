import React from 'react';
import ReactFlow, { MiniMap, Controls, Panel } from 'reactflow';
import ActionMenu from './ActionMenu';
import TableNode from './TableNode'

const nodeTypes = {
  tableNode: TableNode,
};

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

export default function Flow({nodes, edges, onConnect, onNodesChange, onEdgesChange, handleAddTable}) {
      
  /* TODO:
    Incorporate ability to define/edit fields for a table
  */
  return (
    <div style={{ width: `calc(100vw - 50px)`, height: `calc(100vh - 112px)` }}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        >
            <Panel position="top-right">
                <ActionMenu 
                  handleAddTable = {handleAddTable}
                />
            </Panel>
            <Controls />
            <MiniMap pannable = 'true' zoomable = 'true' />
        </ReactFlow>
    </div>
  );
}