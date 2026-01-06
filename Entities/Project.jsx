{
  "name": "Project",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Project name"
    },
    "description": {
      "type": "string",
      "description": "Project description"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "analyzing",
        "ready",
        "in_progress",
        "completed"
      ],
      "default": "draft"
    },
    "blueprint_url": {
      "type": "string",
      "description": "Uploaded blueprint image URL"
    },
    "location": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip_code": {
          "type": "string"
        },
        "region": {
          "type": "string"
        }
      }
    },
    "extracted_data": {
      "type": "object",
      "description": "AI-extracted blueprint data",
      "properties": {
        "total_sqft": {
          "type": "number"
        },
        "floors": {
          "type": "number"
        },
        "rooms": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "dimensions": {
          "type": "object"
        },
        "structural_elements": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "roof_type": {
          "type": "string"
        },
        "foundation_type": {
          "type": "string"
        }
      }
    },
    "material_selections": {
      "type": "object",
      "description": "User-selected materials and options"
    },
    "phase_estimates": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "Cost estimates per construction phase"
    },
    "schedule": {
      "type": "object",
      "description": "Project timeline and schedule",
      "properties": {
        "start_date": {
          "type": "string",
          "format": "date"
        },
        "end_date": {
          "type": "string",
          "format": "date"
        },
        "total_duration_days": {
          "type": "number"
        },
        "phases": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "phase_id": {
                "type": "string"
              },
              "phase_name": {
                "type": "string"
              },
              "duration_days": {
                "type": "number"
              },
              "start_date": {
                "type": "string"
              },
              "end_date": {
                "type": "string"
              },
              "dependencies": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "total_material_cost": {
      "type": "number"
    },
    "total_labor_cost": {
      "type": "number"
    },
    "total_estimate": {
      "type": "number"
    },
    "shared_with": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Email addresses of shared users"
    }
  },
  "required": [
    "name"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "id": {
          "$ne": null
        }
      }
    },
    "read": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "shared_with": {
            "$in": [
              "{{user.email}}"
            ]
          }
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "update": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "delete": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    }
  }
}