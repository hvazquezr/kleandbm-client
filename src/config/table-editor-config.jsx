const dataTypes = [
    'Int', 
    'Varchar', 
    'Float'
];

export const columnProperties = [
    {
        field: 'name', 
        headerName: 'Name',
        width: 180,
        editable: true 
    },
    {
        field: 'dataType',
        headerName: 'Data Type',
        width: 180,
        editable: true,
        type: 'singleSelect',
        valueOptions: dataTypes
    },
    {
        field: 'primaryKey',
        headerName: 'PK',
        type: 'boolean',
        width: 50,
        editable: true
    },
    {
        field: 'description',
        headerName: 'Description',
        type: 'text',
        width: 500,
        align: 'left',
        headerAlign: 'left',
        editable: true
    }
];