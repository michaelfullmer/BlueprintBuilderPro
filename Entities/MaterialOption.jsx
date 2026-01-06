{
  "name": "MaterialOption",
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": [
        "siding",
        "roofing",
        "flooring",
        "windows",
        "doors",
        "insulation",
        "paint",
        "fixtures",
        "lumber",
        "concrete",
        "electrical",
        "plumbing",
        "drywall"
      ]
    },
    "name": {
      "type": "string"
    },
    "type": {
      "type": "string"
    },
    "brand": {
      "type": "string"
    },
    "quality_tier": {
      "type": "string",
      "enum": [
        "budget",
        "mid_range",
        "premium",
        "luxury"
      ]
    },
    "unit": {
      "type": "string"
    },
    "price_per_unit": {
      "type": "number"
    },
    "supplier": {
      "type": "string"
    },
    "specifications": {
      "type": "object",
      "properties": {
        "color": {
          "type": "string"
        },
        "thickness": {
          "type": "string"
        },
        "warranty_years": {
          "type": "number"
        },
        "energy_rating": {
          "type": "string"
        },
        "r_value": {
          "type": "number"
        }
      }
    },
    "image_url": {
      "type": "string"
    }
  },
  "required": [
    "category",
    "name",
    "price_per_unit"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "user_condition": {
        "id": {
          "$ne": null
        }
      }
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}