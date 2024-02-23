// UndoContext.js
import React from 'react';

const UndoContext = React.createContext({
    addToUndoStack: () => {}, // Placeholder function
    updateNotePartial: () => {}
});

export default UndoContext;