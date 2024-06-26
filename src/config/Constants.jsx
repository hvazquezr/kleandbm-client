export const databaseTechnologies = [
    {
        id: 1,
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
        ],
        columnNameValidator: function (columnName) {
            // Define basic reserved Snowflake keywords (extend this list as needed)
            // Note: This is a simplified list; consider referencing the full list from Snowflake documentation
            const reservedKeywords = ['COLUMN', 'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'FROM', 'WHERE'];
        
            // Check if the name is meaningful
            if (!columnName || columnName.trim().length === 0) {
                return 'Column name must not be empty.';
            }
        
            // Check length (Snowflake supports up to 255 characters)
            if (columnName.length > 255) {
                return 'Column name must not exceed 255 characters.';
            }
        
            // Check for reserved keywords (assuming columnName is provided in its normalized form or checking is case-insensitive)
            if (reservedKeywords.includes(columnName.toUpperCase())) {
                return 'Column name must not use reserved Snowflake keywords.';
            }
        
            // Check for special characters in unquoted identifiers
            if (!/^[A-Za-z0-9_]+$/.test(columnName)) {
                return 'Column name must only contain alphanumeric characters and underscores for unquoted identifiers.';
            }
        
            // If all checks pass
            return '';
        },
        tableNameValidator: function (tableName) {
            // Define basic reserved Snowflake keywords (this list might need adjustments for table-specific context)
            const reservedKeywords = [
                'COLUMN', 'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 
                'ALTER', 'DROP', 'TABLE', 'VIEW', 'FROM', 'WHERE', 'JOIN', 
                'GROUP', 'ORDER', 'LIMIT'
            ];
        
            // Check if the name is meaningful
            if (!tableName || tableName.trim().length === 0) {
                return 'Table name must not be empty.';
            }
        
            // Check length (Snowflake supports up to 255 characters for identifiers)
            if (tableName.length > 255) {
                return 'Table name must not exceed 255 characters.';
            }
        
            // Check for reserved keywords (assuming tableName is provided in its normalized form or checking is case-insensitive)
            if (reservedKeywords.includes(tableName.toUpperCase())) {
                return 'Table name must not use reserved Snowflake keywords.';
            }
        
            // Check for special characters in unquoted identifiers
            if (!/^[A-Za-z0-9_]+$/.test(tableName)) {
                return 'Table name must only contain alphanumeric characters and underscores for unquoted identifiers.';
            }
        
            // If all checks pass
            return '';
        }                
    },
    {
        id: 2,
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
        ],
        columnNameValidator: function (columnName) {
            // Define basic reserved Databricks/Spark SQL keywords (extend this list as needed)
            // Note: This is a simplified list; consider referencing the full list from Spark SQL documentation
            const reservedKeywords = [
                'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'DROP', 'TABLE',
                'VIEW', 'FROM', 'WHERE', 'COLUMN', 'DATABASE', 'FUNCTION'
            ];
        
            // Check if the name is meaningful
            if (!columnName || columnName.trim().length === 0) {
                return 'Column name must not be empty.';
            }
        
            // Optional: Check length for practical limits (e.g., 128 characters)
            if (columnName.length > 128) {
                return 'Column name must not exceed 128 characters for compatibility reasons.';
            }
        
            // Check for reserved keywords (assuming columnName is provided in its normalized form or checking is case-insensitive)
            if (reservedKeywords.includes(columnName.toUpperCase())) {
                return 'Column name must not use reserved Databricks/Spark SQL keywords.';
            }
        
            // Check for special characters in unquoted identifiers
            // Spark SQL is more permissive in terms of identifier characters, but sticking to
            // alphanumeric and underscores for simplicity and compatibility
            if (!/^[A-Za-z0-9_]+$/.test(columnName)) {
                return 'Column name must only contain alphanumeric characters and underscores for unquoted identifiers.';
            }
        
            // If all checks pass
            return '';
        },
        tableNameValidator:function (tableName) {
            // Define basic reserved Databricks/Spark SQL keywords (extend this list as needed)
            // Note: This is a simplified list; consider referencing the full list from Spark SQL documentation
            const reservedKeywords = [
                'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'DROP', 'TABLE',
                'VIEW', 'FROM', 'WHERE', 'DATABASE', 'FUNCTION', 'JOIN'
            ];
        
            // Check if the name is meaningful
            if (!tableName || tableName.trim().length === 0) {
                return 'Table name must not be empty.';
            }
        
            // Optional: Check length for practical limits (e.g., 128 characters)
            if (tableName.length > 128) {
                return 'Table name must not exceed 128 characters for compatibility reasons.';
            }
        
            // Check for reserved keywords (assuming tableName is provided in its normalized form or checking is case-insensitive)
            if (reservedKeywords.includes(tableName.toUpperCase())) {
                return 'Table name must not use reserved Databricks/Spark SQL keywords.';
            }
        
            // Check for special characters in unquoted identifiers
            // Spark SQL is more permissive in terms of identifier characters, but sticking to
            // alphanumeric and underscores for simplicity and compatibility
            if (!/^[A-Za-z0-9_]+$/.test(tableName)) {
                return 'Table name must only contain alphanumeric characters and underscores for unquoted identifiers.';
            }
        
            // If all checks pass
            return '';
        }
        
        
    },
    {
        id: 3,
        name: 'SQL Server',
        active: true,
        tableNameValidator: function(tableName) {
            // Define basic reserved SQL keywords (extend this list as needed)
            const reservedKeywords = ['TABLE', 'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'DROP', 'EXEC', 'WHERE', 'FROM', 'JOIN'];
        
            // Check if the name is meaningful
            if (!tableName || tableName.trim().length === 0) {
              return 'Table name must not be empty.';
            }
        
            // Check length
            if (tableName.length > 128) {
              return 'Table name must not exceed 128 characters.';
            }
        
            // Check for reserved keywords
            if (reservedKeywords.includes(tableName.toUpperCase())) {
                return 'Table name must not use reserved SQL keywords.';
            }
        
            // Check for special characters
            if (!/^[A-Za-z0-9_]+$/.test(tableName)) {
                return 'Table name must only contain alphanumeric characters and underscores.';
            }
        
            // If all checks pass
            return '';
        },
        columnNameValidator: function(columnName) {
            // Define basic reserved SQL keywords (extend this list as needed)
            const reservedKeywords = ['COLUMN', 'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'DROP', 'EXEC', 'WHERE', 'FROM', 'JOIN'];
        
            // Check if the name is meaningful
            if (!columnName || columnName.trim().length === 0) {
              return 'Column name must not be empty.';
            }
        
            // Check length
            if (columnName.length > 128) {
              return 'Column name must not exceed 128 characters.';
            }
        
            // Check for reserved keywords
            if (reservedKeywords.includes(columnName.toUpperCase())) {
                return 'Column name must not use reserved SQL keywords.';
            }
        
            // Check for special characters
            if (!/^[A-Za-z0-9_]+$/.test(columnName)) {
                return 'Column name must only contain alphanumeric characters and underscores.';
            }
        
            // If all checks pass
            return '';
        },
        dataTypes: [
            { id: 1, name: "bigint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 2, name: "int", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 3, name: "smallint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 4, name: "tinyint", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
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
        id: 4,
        name: 'MySql',
        active: true,
        dataTypes: [
            { id: 1, name: "INTEGER", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 2, name: "INT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 3, name: "SMALLINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 4, name: "TINYINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true , supportsAutoIncrement: true},
            { id: 5, name: "MEDIUMINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
            { id: 6, name: "BIGINT", needsMaxLength: false, needsPrecision: false, needsScale: false, active: true, supportsAutoIncrement: true },
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
        ],
    columnNameValidator: function (columnName) {
        // Reusing the reservedKeywords from the table name validation as an example
        const reservedKeywords = ['SELECT', 'CREATE', 'INSERT', 'UPDATE', 'DELETE', 'COLUMN'];
    
        if (!columnName || columnName.trim().length === 0) {
            return 'Column name must not be empty.';
        }
    
        if (columnName.length > 64) {
            return 'Column name must not exceed 64 characters.';
        }
    
        if (/^[0-9]/.test(columnName)) {
            return 'Column name must not start with a number.';
        }
    
        if (!/^[A-Za-z0-9$_]+$/.test(columnName)) {
            return 'Column name must only contain alphanumeric characters, dollar signs, and underscores.';
        }
    
        if (reservedKeywords.includes(columnName.toUpperCase())) {
            return `Column name must not use reserved MySQL keywords: ${columnName}`;
        }
    
        return '';
    },
    tableNameValidator: function (tableName) {
        // Define basic reserved MySQL keywords (this is not a comprehensive list)
        const reservedKeywords = ['SELECT', 'CREATE', 'INSERT', 'UPDATE', 'DELETE', 'TABLE'];
    
        if (!tableName || tableName.trim().length === 0) {
            return 'Table name must not be empty.';
        }
    
        if (tableName.length > 64) {
            return 'Table name must not exceed 64 characters.';
        }
    
        if (/^[0-9]/.test(tableName)) {
            return 'Table name must not start with a number.';
        }
    
        if (!/^[A-Za-z0-9$_]+$/.test(tableName)) {
            return 'Table name must only contain alphanumeric characters, dollar signs, and underscores.';
        }
    
        if (reservedKeywords.includes(tableName.toUpperCase())) {
            return `Table name must not use reserved MySQL keywords: ${tableName}`;
        }
    
        return '';
    }
}
];