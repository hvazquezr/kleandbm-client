import React, { useCallback } from 'react';
import { useStore, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info'

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
                    }}
                    className="nodrag nopan"
        >
          <InfoIcon sx={{color: "#AAA"}} fontSize="small" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;