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
import Joyride, {STATUS } from 'react-joyride';
import TourToolTip from './TourToolTip';
import Cookies from 'js-cookie';

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
  lastChange,
  projectCreatorName,
  dbTechnology,
  undo,
  undoStack,
  onSubmitChangeName
}) {

  const [paneMenu, setPaneMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [edgeMenu, setEdgeMenu] = useState(null);
  const deletePressed = useKeyPress(['Delete', 'Backspace']) 
  const ref = useRef(null);

  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([
    {
      title: 'Navigation Panel',
      content: 'Click on this icon to access the Navigation Panel.',
      event: 'hover',
      disableBeacon: true,
      placement: 'auto',
      target: '.drawer-icon',
    },
    {
      title: 'More Options',
      content: 'Rename the diagram, see version history, generate DDL SQL, and download an image from this menu.',
      event: 'hover',
      disableBeacon: true,
      placement: 'auto',
      target: '.more-icon',
    },
    {
      title: 'Edit Table',
      content: 'Right-click on a table to edit or delete a table.',
      image: '/images/table_context_menu.png',
      imageAlt: 'Edit Table',
      event: 'hover',
      disableBeacon: true,
      placement: 'auto',
      target: '.node-table',
    },
    {
      title: 'Create Relationships',
      content: 'Drag the bottom handlers and connect them to the top handlers to establish a parent-child relationship.',
      image: '/images/relationship_animated.gif',
      imageAlt: 'Create Relationships',
      event: 'hover',
      disableBeacon: true,
      placement: 'auto',
      target: '.handler',
    },
    {
      title: 'Delete Relationships',
      content: 'Right-click on the relationship handle to delete a relationship.',
      image: '/images/relationship_context_menu.png',
      imageAlt: 'Delete Relationships',
      event: 'hover',
      disableBeacon: true,
      placement: 'center',
      target: 'body'
    },
    {
      title: 'Panel Context Menu',
      content: 'Right-click on an empty space in the panel to access additional actions.',
      image: '/images/pane_context_menu.png',
      imageAlt: 'Panel Context Menu',
      disableBeacon: true,
      placement: 'center',
      target: 'body'
    }
  ]);

    const handleJoyrideCallback = (data) => {
      const { status, type } = data;
      const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
  
      if (finishedStatuses.includes(status)) {
        // ask if they don't want to see it again
        setRun(false);
      }  
    };

    useEffect(() => {
      const tourSeen = Cookies.get('tour_seen');
      //if (true) {
      if (!tourSeen) {
        setRun(true);
      }
    }, [])

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
      <Joyride
        callback={handleJoyrideCallback}
        tooltipComponent={TourToolTip}
        continuous
        run={run}
        scrollToFirstStep
        disableScrolling
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            overlayColor: 'rgba(0, 0, 0, .6)',
            zIndex: 1000,
          },
        }}
      />
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
                targetClass = "drawer-icon"
              />
            </Panel>
            <Panel position="top-right" className='more-icon'>
              <ProjectInformation
                projectId = {projectId}
                projectName = {projectName} 
                onProjectNameChange = {onProjectNameChange}
                onProjectNameBlur = {onProjectNameBlur}
                projectDescription = {projectDescription}
                onProjectDescriptionChange = {onProjectDescriptionChange}
                onProjectDescriptionBlur = {onProjectDescriptionBlur}
                lastChange = {lastChange}
                projectCreatorName = {projectCreatorName}
                dbTechnology={dbTechnology}
                onSubmitChangeName = {onSubmitChangeName}
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