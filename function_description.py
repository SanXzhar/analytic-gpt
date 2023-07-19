function_description = [
    {
        "name": "null_info",
        "description": "Gets all null and NA values from raw data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "info",
        "description": "Gets all normal values from raw data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "descriptive_analysis",
        "description" : "Describes all values in raw data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "target_analysis",
        "description": "Target analysis on one graph",
        "parameters": {
            "type": "object",
            "properties": {
                "column": {
                    "type": "string",
                    "description": "name of column on which should be done Target analysis"
                }
            },
            "required": ["column"]
        }
    },
    {
        "name": "distribution_columns",
        "description": "Numerical bar graph",
         "parameters": {
            "type": "object",
            "properties": {
                "column": {
                    "type": "string",
                    "description": "name of column on which should be done numerical bar"
                }
            },
            "required": ["column"]
        }
    },
    {
        "name": "count_plot",
        "description": "Cout plot for raw data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "box_plots",
        "desciption" : "Box plots on numerical data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "outlier_analysis",
        "description": "Gets outlining data from raw data",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    }
]

# "properties": {
#                         "year": {
#                             "type": "integer",
#                             "description": "The year the user would like to make an edit to their forecast for",
#                         },
#                         "category": {
#                             "type": "string",
#                             "description": "The category of the edit a user would like to edit"
#                         },
#                         "amount": {
#                             "type": "integer",
#                             "description": "The amount of units the user would like to change"
#                         },
#                     },
#                     "required": ["year", "category", "amount"],