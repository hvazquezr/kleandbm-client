// UndoContext.js
import React from 'react';

const UndoContext = React.createContext({
    addToUndoStack: () => {}, // Placeholder function
    updateNotePartial: () => {},
    restoreNotePartial: () => {}
});

export default UndoContext;