function_descriptions = [
    {
        "name": "info",
        "description": "Displays all information in the file.",
        "parameters": {
            "type": "object",
            "properties": {
                "user_query": {
                    "type": "string",
                    "description": "User's input regarding file",
                },
            },
            "required": ["user_query"],
        },
        "name": "null_info",
        "description": "Displays all null information in the file",
        "parameters": {
            "type": "object",
            "properties": {
                "user_query": {
                    "type": "string",
                    "description": "User's input regarding file",
                },
            },
            "required": ["user_query"],
        },
        "name": "descriptive_analysis",
        "description": "Describes information in the file",
        "parameters": {
            "type": "object",
            "properties": {
                "user_query": {
                    "type": "string",
                    "description": "User's input regarding file",
                },
            },
            "required": ["user_query"],
        }
    }
]