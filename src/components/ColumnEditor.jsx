import React, { useState } from 'react';
import { Checkbox, TextField, Autocomplete, Tooltip, IconButton, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

export const ColumnEditor = ({ column, onColumnChange, onRemoveColumn, dataTypes, columnErrors, isChildColumn }) => {
    const [editedColumn, setEditedColumn] = useState(column);
    const currentDataType = dataTypes.find(dt => dt.name === column.dataType);
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

    const coverWidth = 510;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
    
        let updatedColumn = { ...editedColumn, [name]: newValue };
    
        // If primaryKey is being set to true, also set canBeNull to false
        if (name === "primaryKey" && newValue === true) {
            updatedColumn.canBeNull = false;
        }
    
        // Log, set the edited column, and trigger column change callback with the updated column
        setEditedColumn(updatedColumn);
        onColumnChange(updatedColumn);
    };
    

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setEditedColumn({ ...editedColumn, dataType: newValue.name });
            onColumnChange({ ...editedColumn, dataType: newValue.name });
        }
    };

    // Function to check if an error exists for a given columnId and fieldName
    const hasError = (columnId, fieldName) => {
        return (columnErrors[columnId] && columnErrors[columnId][fieldName]);
    };

    //console.log(currentDataType)

    return (
        <React.Fragment>
            <DragIndicatorIcon sx={{ '&:hover': { cursor: 'pointer' } }}/>
            <TextField name="name" hiddenLabel variant="filled" size="small" margin="dense" value={editedColumn.name} onChange={handleChange}
                InputProps={{
                    inputProps: {
                        style: { padding: '7px' } // Adjust the padding value as needed
                    }
                }}
                sx={{width: 180}}
                error={hasError(editedColumn.id, 'name')}
            />
            <Autocomplete
                onChange={handleAutocompleteChange}
                value={currentDataType || null}
                options={dataTypes}
                getOptionLabel={(option) => option.name}
                disabled={isChildColumn}
                renderInput={(params) => <TextField error={hasError(editedColumn.id, 'dataType')} variant="filled" {...params} 
                sx={{
                    '& .MuiInputBase-root': {
                      paddingTop: '0px', // Adjust top padding
                      paddingBottom: '0px', // Adjust bottom padding
                      // You can also adjust paddingLeft and paddingRight if needed
                    },
                    width:160,
                    display: isDescriptionFocused?'none':'block'
                  }}              
                />}
                
                isOptionEqualToValue={(option, value) => option.name === value.name}
            />
            <TextField name="maxLength" hiddenLabel variant="filled" size="small" margin="dense" value={editedColumn.maxLength ?? ''} onChange={handleChange}
                type="number"
                error={hasError(editedColumn.id, 'maxLength')}
                InputProps={{
                    inputProps: {
                        style: { padding: '7px' } // Adjust the padding value as needed
                    }
                }}
                sx={{
                    width: 70,
                    display: isDescriptionFocused?'none':'block',
                    visibility: !(currentDataType && currentDataType.needsMaxLength)?'hidden':'visible'
                }} />
            <TextField name="precision" hiddenLabel variant="filled" size="small" margin="dense" value={editedColumn.precision ?? ''} onChange={handleChange}
                type="number"
                error={hasError(editedColumn.id, 'precision')}
                InputProps={{
                    inputProps: {
                        style: { padding: '7px' } // Adjust the padding value as needed
                    }
                }}
                sx={{
                    width: 70,
                    display: isDescriptionFocused?'none':'block',
                    visibility: !(currentDataType && currentDataType.needsPrecision)?'hidden':'visible'
                }} />
            <TextField name="scale" hiddenLabel variant="filled" size="small" margin="dense" value={editedColumn.scale ?? ''} onChange={handleChange}
                type="number"
                error={hasError(editedColumn.id, 'precision')}
                InputProps={{
                    inputProps: {
                        style: { padding: '7px' } // Adjust the padding value as needed
                    }
                }}
                sx={{
                    width: 70,
                    display: isDescriptionFocused?'none':'block',
                    visibility: !(currentDataType && currentDataType.needsScale)?'hidden':'visible'
                }} />
            <Checkbox name="primaryKey" checked={editedColumn.primaryKey ?? false} onChange={handleChange} sx={{ p: 0, display: isDescriptionFocused?'none':'block'}} />
            <Checkbox
                name="canBeNull"
                checked={!column.primaryKey && (editedColumn.canBeNull ?? false)}
                disabled={column.primaryKey}
                onChange={handleChange}
                sx={{ p: 0, display: isDescriptionFocused ? 'none' : 'block' }}
            />
            <Checkbox name="autoIncrementOn" checked={editedColumn.autoIncrementOn ?? false} onChange={handleChange} sx={{ p: 0, display: isDescriptionFocused?'none':'block' }} disabled={!currentDataType?.supportsAutoIncrement}/>
            <Tooltip title={editedColumn.description} arrow disableFocusListener disableTouchListener enterDelay={200} leaveDelay={200}>
                <TextField name="description" hiddenLabel variant="filled" size="small" margin="dense" value={editedColumn.description} onChange={handleChange}
                    onFocus={() => setIsDescriptionFocused(true)}
                    onBlur={() => setIsDescriptionFocused(false)}
                    sx={{
                        '& input': {
                            padding: '7px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            width: '100%' // Adjust width when focused
                        },
                        marginLeft: isDescriptionFocused ? `-${coverWidth}px` : 0, // Negative margin when focused
                        width: isDescriptionFocused ? 120 + coverWidth: 120, // Adjust width when focused
                        zIndex: isDescriptionFocused ? 100 : 0, // Ensure it covers other elements
                        transition: 'all 0.3s ease', // Smooth transition for effect
                    }} />
            </Tooltip>
            <IconButton aria-label="delete" size="small" sx={{display: (isDescriptionFocused || editedColumn.primaryKey || isChildColumn)?'none':'block'}} onClick={() => onRemoveColumn(editedColumn.id)}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
};
