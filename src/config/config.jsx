export const databaseTechnologies = [
    {
        id: '1',
        name: 'Snowflake',
        active: true,
        dataTypes: [
            {
                id: 1,
                name: "VARCHAR",
                needsMaxLength: true,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 2,
                name: "NUMBER",
                needsMaxLength: false,
                needsPrecision: true,
                needsScale: true,
                active: true
            },
            {
                id: 3,
                name: "INTEGER",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 4,
                name: "FLOAT",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 5,
                name: "BOOLEAN",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 6,
                name: "DATE",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 7,
                name: "TIMESTAMP",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 8,
                name: "VARIANT",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 9,
                name: "OBJECT",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 10,
                name: "ARRAY",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 11,
                name: "GEOGRAPHY",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            },
            {
                id: 12,
                name: "GEOMETRY",
                needsMaxLength: false,
                needsPrecision: false,
                needsScale: false,
                active: true
            }                            
        ]
    },
    {
        id: '2',
        name: 'Databricks',
        active: true,
        dataTypes: [
            { id: 1, name: "BIGINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 2, name: "BINARY", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 3, name: "BOOLEAN", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 4, name: "DATE", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 5, name: "DECIMAL", needsMaxLength: false, needsPrecision: true, needsScale: true, active: true },
            { id: 6, name: "DOUBLE", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 7, name: "FLOAT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 8, name: "INT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 9, name: "INTERVAL", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 10, name: "SMALLINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 11, name: "STRING", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 12, name: "TIMESTAMP", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 13, name: "TIMESTAMP_NTZ", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 14, name: "TINYINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 15, name: "ARRAY", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 16, name: "MAP", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 17, name: "STRUCT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true }
        ]
    },
    {
        id: '3',
        name: 'SQL Server',
        active: true,
        dataTypes: [
            { id: 1, name: "bigint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 2, name: "int", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 3, name: "smallint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 4, name: "tinyint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 5, name: "bit", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 6, name: "decimal", needsMaxLength: false, needsPrecision: true, needsScale: true, active: true },
            { id: 7, name: "numeric", needsMaxLength: false, needsPrecision: true, needsScale: true, active: true },
            { id: 8, name: "money", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 9, name: "smallmoney", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 10, name: "float", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 11, name: "real", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 12, name: "datetime", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 13, name: "smalldatetime", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 14, name: "char", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 15, name: "varchar", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 16, name: "text", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 17, name: "nchar", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 18, name: "nvarchar", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 19, name: "ntext", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 20, name: "binary", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 21, name: "varbinary", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 22, name: "image", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 23, name: "cursor", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 24, name: "sql_variant", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 25, name: "table", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 26, name: "timestamp", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 27, name: "uniqueidentifier", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true }
        ]
    },
    {
        id: '4',
        name: 'MySql',
        active: true,
        dataTypes: [
            { id: 1, name: "INTEGER", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 2, name: "INT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 3, name: "SMALLINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 4, name: "TINYINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 5, name: "MEDIUMINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 6, name: "BIGINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 7, name: "DECIMAL", needsMaxLength: false, needsPrecision: true, needsScale: true, active: true },
            { id: 8, name: "NUMERIC", needsMaxLength: false, needsPrecision: true, needsScale: true, active: true },
            { id: 9, name: "FLOAT", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 10, name: "DOUBLE", needsMaxLength: false, needsPrecision: true, needsScale: false, active: true },
            { id: 11, name: "DATE", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 12, name: "DATETIME", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 13, name: "TIMESTAMP", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 14, name: "TIME", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 15, name: "YEAR", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 16, name: "CHAR", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 17, name: "VARCHAR", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 18, name: "BINARY", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 19, name: "VARBINARY", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 20, name: "BLOB", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 21, name: "TEXT", needsMaxLength: true, needsPrecision: false, needsScale: false, active: true },
            { id: 22, name: "ENUM", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 23, name: "SET", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true },
            { id: 24, name: "JSON", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true }
        ]
    }
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