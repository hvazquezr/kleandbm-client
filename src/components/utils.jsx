import { Position } from 'reactflow'
import { databaseTechnologies } from '../config/Constants'

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.width / 2;
  const y1 = targetPosition.y + targetNode.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

  // Function used to force teh copy of an object and trigger the Flow update
  export function deepCopyObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    // Handle Array
    if (Array.isArray(obj)) {
      const arrCopy = [];
      obj.forEach((v, i) => arrCopy[i] = deepCopyObject(v));
      return arrCopy;
    }
  
    // Handle Object
    if (obj instanceof Object) {
      const objCopy = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          objCopy[key] = deepCopyObject(obj[key]);
        }
      }
      return objCopy;
    }
  
    throw new Error("Unable to copy object!");
  }

  export function getCurrentIsoTime() {
    const now = new Date(); // Create a new date object with the current date and time
    return now.toISOString().replace('Z', '');
    //return now.getTime(); // Return the UNIX timestamp in milliseconds
  }

  export function lookupDbTechnology(id) {
    const dbTechnology = databaseTechnologies.find(dbTechnology => dbTechnology.id === id);
    return dbTechnology ? dbTechnology.name : null;
}

export function getUniqueColumnName(columns, name) {
  let newName = name;
  let counter = 1;

  // A function to check if the newName exists in the columns array
  const nameExists = (nameToCheck) => columns.some(column => column.name === nameToCheck);

  // While newName exists in the array, append/increment the counter
  while (nameExists(newName)) {
    newName = `${name}_${counter}`;
    counter += 1;
  }

  return newName;
}