import React, { useCallback } from 'react';
import { useStore, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';

import { getEdgeParams } from './utils.jsx';

function FloatingEdge({ id, source, target, markerEnd, markerStart, style }) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
                    style={{
                      position: 'absolute',
                      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                      pointerEvents: 'all',
                      backgroundColor: '#FFF',
                      border: '2px solid #AAA',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      justifyContent: 'center', /* Center horizontally */
                      alignItems: 'center' /* Center vertically */
                    }}
                    className="nodrag nopan"
        />
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;