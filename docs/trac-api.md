{
  "swagger": "2.0",
  "info": {
    "title": "TAP Protocol API",
    "description": "API documentation for TAP Protocol",
    "version": "1.0.1"
  },
  "definitions": {

  },
  "paths": {
    "/getSyncStatus": {
      "get": {
        "description": "Get the percentage of synced blocks",
        "tags": [
          "Node"
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getReorgs": {
      "get": {
        "description": "Get a list of reorgs that occurred on the connected writer since its existence.",
        "tags": [
          "Node"
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getCurrentBlock": {
      "get": {
        "description": "Get the current block of the indexer.",
        "tags": [
          "Node"
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerDeployedListLength/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns the length of deployments of a given ticker and tx hash.",
        "tags": [
          "Transactions: Deployed"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerDeployedList/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns deployments of a given ticker and tx hash.",
        "tags": [
          "Transactions: Deployed"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployedListLength/{transaction_hash}": {
      "get": {
        "description": "Returns deployments of a given tx hash.",
        "tags": [
          "Transactions: Deployed"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployedList/{transaction_hash}": {
      "get": {
        "description": "Returns the length of deployments of a given tx hash.",
        "tags": [
          "Transactions: Deployed"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerDeployedListByBlockLength/{ticker}/{block}": {
      "get": {
        "description": "Returns the length of deployments of a given ticker and block.",
        "tags": [
          "Blocks: Deployed"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerDeployedListByBlock/{ticker}/{block}": {
      "get": {
        "description": "Returns deployments of a given ticker and block.",
        "tags": [
          "Blocks: Deployed"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployedListByBlockLength/{block}": {
      "get": {
        "description": "Returns the length of deployments of a given block.",
        "tags": [
          "Blocks: Deployed"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployedListByBlock/{block}": {
      "get": {
        "description": "Returns deployments of a given block.",
        "tags": [
          "Blocks: Deployed"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerMintedListLength/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns the length of mint inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Minted"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerMintedList/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns mint inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Minted"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintedListLength/{transaction_hash}": {
      "get": {
        "description": "Returns mint inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Minted"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintedList/{transaction_hash}": {
      "get": {
        "description": "Returns the length of mint inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Minted"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerMintedListByBlockLength/{ticker}/{block}": {
      "get": {
        "description": "Returns the length of mint inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Minted"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerMintedListByBlock/{ticker}/{block}": {
      "get": {
        "description": "Returns mint inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Minted"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintedListByBlockLength/{block}": {
      "get": {
        "description": "Returns the length of mint inscriptions of a given block.",
        "tags": [
          "Blocks: Minted"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintedListByBlock/{block}": {
      "get": {
        "description": "Returns mint inscriptions of a given block.",
        "tags": [
          "Blocks: Minted"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerInscribeTransferListLength/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns the length of transfer-inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerInscribeTransferList/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns transfer-inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getInscribeTransferListLength/{transaction_hash}": {
      "get": {
        "description": "Returns transfer-inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getInscribeTransferList/{transaction_hash}": {
      "get": {
        "description": "Returns the length of transfer-inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerInscribeTransferListByBlockLength/{ticker}/{block}": {
      "get": {
        "description": "Returns the length of transfer-inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerInscribeTransferListByBlock/{ticker}/{block}": {
      "get": {
        "description": "Returns transfer-inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getInscribeTransferListByBlockLength/{block}": {
      "get": {
        "description": "Returns the length of transfer-inscriptions of a given block.",
        "tags": [
          "Blocks: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getInscribeTransferListByBlock/{block}": {
      "get": {
        "description": "Returns transfer-inscriptions of a given block.",
        "tags": [
          "Blocks: Inscribe Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTransferredListLength/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns the length of actual transferred inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTransferredList/{ticker}/{transaction_hash}": {
      "get": {
        "description": "Returns actual transferred inscriptions of a given ticker and tx hash.",
        "tags": [
          "Transactions: Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferredListLength/{transaction_hash}": {
      "get": {
        "description": "Returns actual transferred inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferredList/{transaction_hash}": {
      "get": {
        "description": "Returns the length of actual transferred inscriptions of a given tx hash.",
        "tags": [
          "Transactions: Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "transaction_hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTransferredListByBlockLength/{ticker}/{block}": {
      "get": {
        "description": "Returns the length of actual transferred inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Transferred"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTransferredListByBlock/{ticker}/{block}": {
      "get": {
        "description": "Returns actual transferred inscriptions of a given ticker and block.",
        "tags": [
          "Blocks: Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferredListByBlockLength/{block}": {
      "get": {
        "description": "Returns the length of actual transferred inscriptions of a given block.",
        "tags": [
          "Blocks: Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferredListByBlock/{block}": {
      "get": {
        "description": "Returns actual transferred inscriptions of a given block.",
        "tags": [
          "Blocks: Transferred"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintHoldersHistoryListLength/{inscription_id}": {
      "get": {
        "description": "Returns the amount of holder changes for a given DMT Mint.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintHoldersHistoryList/{inscription_id}": {
      "get": {
        "description": "Returns the amount of holder changes for a given DMT Mint.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintHolder/{inscription_id}": {
      "get": {
        "description": "Returns a history object with element, owner and block data.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmap/{bitmap_block}": {
      "get": {
        "description": "Returns the current state of a Bitmap.",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "bitmap_block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmapByInscription/{inscription_id}": {
      "get": {
        "description": "Returns the current state of a Bitmap with the given inscription id",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmapWalletHistoricListLength/{address}": {
      "get": {
        "description": "Returns the size of all current and ever held bitmaps of an address. For real-time lookups, combine with getBitmap() to filter against the current holdings.",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmapWalletHistoricList/{address}": {
      "get": {
        "description": "Returns the size of all current and ever held bitmaps of an address. For real-time lookups, combine with getBitmap() to filter against the current holdings.",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmapEventByBlockLength/{block}": {
      "get": {
        "description": "Returns the size of all events (new bitmaps or transferred of a given Bitcoin block).",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBitmapEventByBlock/{block}": {
      "get": {
        "description": "Returns all events (new bitmaps or transferred of a given Bitcoin block).",
        "tags": [
          "Bitmap"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintHolderByBlock/{ticker}/{block}": {
      "get": {
        "description": "Returns a history object with element, owner and block data but based on a given ticker and block instead of an inscription id.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintWalletHistoricListLength/{address}": {
      "get": {
        "description": "Returns the amount of HISTORIC DMT Mints of an address. For real-time lookups, combine with getDmtMintHolder() to filter against the current holdings.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtMintWalletHistoricList/{address}": {
      "get": {
        "description": "Returns the HISTORICAL ownership of an address of DMT Mints. For real-time lookups, combine with getDmtMintHolder() to filter against the current holdings.",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtEventByBlockLength/{block}": {
      "get": {
        "description": "Returns the size of all events (new unats or transferred of a given Bitcoin block).",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtEventByBlock/{block}": {
      "get": {
        "description": "Returns all events (new unats or transferred of a given Bitcoin block).",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferAmountByInscription/{inscription_id}": {
      "get": {
        "description": "Get transfer amount by inscription ID",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeploymentsLength": {
      "get": {
        "description": "Get the length of deployments",
        "tags": [
          "Deployment"
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployments": {
      "get": {
        "description": "Get a list of deployments",
        "tags": [
          "Deployment"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 100,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDeployment/{ticker}": {
      "get": {
        "description": "Get a specific deployment by ticker",
        "tags": [
          "Deployment"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintTokensLeft/{ticker}": {
      "get": {
        "description": "Get remaining mint tokens for a given ticker",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getBalance/{address}/{ticker}": {
      "get": {
        "description": "Get the balance of a specific address and ticker",
        "tags": [
          "Balance"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferable/{address}/{ticker}": {
      "get": {
        "description": "Get the transferable amount for a specific address and ticker",
        "tags": [
          "Balance"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getSingleTransferable/{inscription_id}": {
      "get": {
        "description": "Get the transferable amount of the exact transferable's inscription id. Returns null if not existing or '0' if spent, else the positive big number transferable amount.",
        "tags": [
          "Balance"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getHoldersLength/{ticker}": {
      "get": {
        "description": "DEPRECATED: use getHistoricHoldersLength() instead. Get the total number of holders for a given ticker ever. To get the realtime holdings, combine this with getBalance() and filter out zero or null balances or use the Mint / Transferred blocks endpoints to index all balanaces into a local database.",
        "tags": [
          "Holders"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getHistoricHoldersLength/{ticker}": {
      "get": {
        "description": "Get the total number of holders for a given ticker. To get the realtime holdings, combine this with getBalance() and filter out zero or null balances or use the Mint / Transferred blocks endpoints to index all balanaces into a local database.",
        "tags": [
          "Holders"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getHolders/{ticker}": {
      "get": {
        "description": "DEPRECATED: use getHistoricHolders() instead. Retrieve a list of holders for a specific ticker ever. To get the realtime holdings, combine this with getBalance() and filter out zero or null balances or use the Mint / Transferred blocks endpoints to index all balanaces into a local database.",
        "tags": [
          "Holders"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "address": {
                        "type": "string"
                      },
                      "balance": {
                        "type": "string"
                      },
                      "transferable": {
                        "oneOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getHistoricHolders/{ticker}": {
      "get": {
        "description": "Retrieve a list of holders for a specific ticker. To get the realtime holdings, combine this with getBalance() and filter out zero or null balances or use the Mint / Transferred blocks endpoints to index all balanaces into a local database.",
        "tags": [
          "Holders"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "address": {
                        "type": "string"
                      },
                      "balance": {
                        "type": "string"
                      },
                      "transferable": {
                        "oneOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountBlockedTransferables/{address}": {
      "get": {
        "description": "Returns true if the given address blocks the creation of transferables.",
        "tags": [
          "Token"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "boolean"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTokensLength/{address}": {
      "get": {
        "description": "Get the total number of tokens held by a specific address",
        "tags": [
          "Token"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTokens/{address}": {
      "get": {
        "description": "Retrieve a list of tokens held by a specific address",
        "tags": [
          "Token"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTokensBalance/{address}": {
      "get": {
        "description": "Retrieves a list of tokens and total balance, transferable of each by an address",
        "tags": [
          "Token"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "data": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "integer"
                    },
                    "list": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "ticker": {
                            "type": "string"
                          },
                          "overallBalance": {
                            "type": "string"
                          },
                          "transferableBalance": {
                            "type": "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTokenDetail/{address}/{ticker}": {
      "get": {
        "description": "Retrieve token info , total balance, transferable balance, tokens transfers list (include sent or not) by specific token of an account",
        "tags": [
          "Token"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getDmtElementsListLength": {
      "get": {
        "description": "Get the total number of DMT elements",
        "tags": [
          "DMT"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getDmtElementsList": {
      "get": {
        "description": "Retrieve a list of DMT elements",
        "tags": [
          "DMT"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountMintListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the number of mints performed by a specific address for a given ticker",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountMintList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of mints performed by a specific address for a given ticker",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerMintListLength/{ticker}": {
      "get": {
        "description": "Get the length of the mint list for a specific ticker",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTickerMintList/{ticker}": {
      "get": {
        "description": "Retrieve a list of mint records for a specific ticker",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getMintListLength": {
      "get": {
        "description": "Get the total number of mints across all tickers",
        "tags": [
          "Minting"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getMintList": {
      "get": {
        "description": "Retrieve a list of all mint records across all tickers",
        "tags": [
          "Minting"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTrade/{inscription_id}": {
      "get": {
        "description": "Retrieve details of a specific trade based on its inscription ID",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountTradesListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the total number of trades for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountReceiveList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of received transactions for a specific address and ticker",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountTradesList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of trades for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAuthCancelled/{inscription_id}": {
      "get": {
        "description": "Check if a given token-auth inscription has been cancelled",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthCancelled/{inscription_id}": {
      "get": {
        "description": "Check if a given privilege-auth inscription has been cancelled",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAuthHashExists/{hash}": {
      "get": {
        "description": "Deprecated: use getAuthCompactHexExists() instead. Check if the given signature's compact hex exists in the token-auth system",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAuthCompactHexExists/{hash}": {
      "get": {
        "description": "Check if the given signature's compact hex exists in the token-auth system",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthHashExists/{hash}": {
      "get": {
        "description": "Deprecated: use getPrivilegeAuthCompactHexExists() instead. Check if the given signature's compact hex exists in the token-auth system",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthCompactHexExists/{hash}": {
      "get": {
        "description": "Check if the given signature's compact hex exists in the token-auth system",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "maxLength": 1024,
            "required": true,
            "in": "path",
            "name": "hash"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getRedeemListLength": {
      "get": {
        "description": "Get the total number of redeems across all tokens",
        "tags": [
          "Token Authority: Redeem"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getRedeemList": {
      "get": {
        "description": "Retrieve a list of all redeem records across all tokens",
        "tags": [
          "Token Authority: Redeem"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountRedeemListLength/{address}": {
      "get": {
        "description": "Get the total number of redeems performed by a specific address",
        "tags": [
          "Token Authority: Redeem"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountRedeemList/{address}": {
      "get": {
        "description": "Retrieve a list of redeem records for a specific address",
        "tags": [
          "Token Authority: Redeem"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountAuthListLength/{address}": {
      "get": {
        "description": "Get the total number of token auth records for a specific address",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountPrivilegeAuthListLength/{address}": {
      "get": {
        "description": "Get the total number of privilege auth records for a specific address",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountAuthList/{address}": {
      "get": {
        "description": "Retrieve a list of token auth records for a specific address",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountPrivilegeAuthList/{address}": {
      "get": {
        "description": "Retrieve a list of privilege auth records for a specific address",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAuthListLength": {
      "get": {
        "description": "Get the total number of token auth records across all addresses",
        "tags": [
          "Token Authority"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getPrivilegeAuthListLength": {
      "get": {
        "description": "Get the total number of privilege auth records across all addresses",
        "tags": [
          "Privilege Authority"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAuthList": {
      "get": {
        "description": "Retrieve a list of all auth records across all addresses",
        "tags": [
          "Token Authority"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthList": {
      "get": {
        "description": "Retrieve a list of all privilege auth records across all addresses",
        "tags": [
          "Privilege Authority"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityVerifiedInscription/{privilege_inscription_id}/{collection_name}/{verified_hash}/{sequence}": {
      "get": {
        "description": "Get the inscription id of the verified asset by passing the full privilege path",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "verified_hash"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "sequence"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityVerifiedByInscription/{verified_inscription_id}": {
      "get": {
        "description": "Get the full privilege path of the verified asset by passing its inscription id",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "verified_inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityIsVerified/{privilege_inscription_id}/{collection_name}/{verified_hash}/{sequence}": {
      "get": {
        "description": "Check if a signature has been verified by an authority",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "verified_hash"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "sequence"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityListLength/{privilege_inscription_id}": {
      "get": {
        "description": "Returns the amount of verified signatures of a privilege authority.",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityList/{privilege_inscription_id}": {
      "get": {
        "description": "Returns the verified items of a privilege authority.",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityCollectionListLength/{privilege_inscription_id}/{collection_name}": {
      "get": {
        "description": "Returns the amount of verified signatures in a collection of a privilege authority.",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityCollectionList/{privilege_inscription_id}/{collection_name}": {
      "get": {
        "description": "Returns the verified items of verified signatures in a collection of a privilege authority.",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByPrivBlockLength/{privilege_authority_inscription_id}/{block}": {
      "get": {
        "description": "Returns the size of all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_authority_inscription_id"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByPrivBlock/{privilege_authority_inscription_id}/{block}": {
      "get": {
        "description": "Returns all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_authority_inscription_id"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByPrivColBlockLength/{privilege_authority_inscription_id}/{collection_name}/{block}": {
      "get": {
        "description": "Returns the size of all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_authority_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByPrivColBlock/{privilege_authority_inscription_id}/{collection_name}/{block}": {
      "get": {
        "description": "Returns all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "privilege_authority_inscription_id"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "collection_name"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByBlockLength/{block}": {
      "get": {
        "description": "Returns the size of all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getPrivilegeAuthorityEventByBlock/{block}": {
      "get": {
        "description": "Returns all events (new verified or transferred of a given Bitcoin block).",
        "tags": [
          "Privilege Authority: Verified"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "integer",
            "required": true,
            "in": "path",
            "name": "block"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTradesListLength/{ticker}": {
      "get": {
        "description": "Get the total number of trades for a specific ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTickerTradesList/{ticker}": {
      "get": {
        "description": "Retrieve a list of trades for a specific ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTradesListLength": {
      "get": {
        "description": "Get the total number of trades across all tickers",
        "tags": [
          "Trades"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTradesList": {
      "get": {
        "description": "Retrieve a list of all trade records across all tickers",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountTransferListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the total number of transfers for a specific address and ticker",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTransferList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of transfer records for a specific address and ticker",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTransferListLength/{ticker}": {
      "get": {
        "description": "Get the total number of transfers for a given ticker",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTickerTransferList/{ticker}": {
      "get": {
        "description": "Retrieve a list of transfer records for a specific ticker",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTransferListLength": {
      "get": {
        "description": "Get the total number of transfers across all tickers",
        "tags": [
          "Transfer"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTransferList": {
      "get": {
        "description": "Retrieve a list of all transfer records across all tickers",
        "tags": [
          "Transfer"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountSentListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the total number of sent transactions for a specific address and ticker",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountSentList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of sent transaction records for a specific address and ticker",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountReceiveTradesFilledListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the total number of trades filled for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountReceiveTradesFilledList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of received trades filled for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountTradesFilledListLength/{address}/{ticker}": {
      "get": {
        "description": "Get the total number of trades filled for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountTradesFilledList/{address}/{ticker}": {
      "get": {
        "description": "Retrieve a list of trades filled for a specific address and ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerTradesFilledListLength/{ticker}": {
      "get": {
        "description": "Get the total number of trades filled for a specific ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTickerTradesFilledList/{ticker}": {
      "get": {
        "description": "Retrieve a list of filled trade records for a specific ticker",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTradesFilledListLength": {
      "get": {
        "description": "Get the total number of filled trades across all tickers",
        "tags": [
          "Trades"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTradesFilledList": {
      "get": {
        "description": "Retrieve a list of trades that have been filled",
        "tags": [
          "Trades"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getTickerSentListLength/{ticker}": {
      "get": {
        "description": "Get the total number of sent transactions for a given ticker",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getTickerSentList/{ticker}": {
      "get": {
        "description": "Retrieve a list of sent transactions for a specific ticker",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "ticker"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getSentListLength": {
      "get": {
        "description": "Get the total length of the sent transactions list",
        "tags": [
          "Sent"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getSentList": {
      "get": {
        "description": "Retrieve the list of all sent transactions",
        "tags": [
          "Sent"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccumulator/{inscription}": {
      "get": {
        "description": "Retrieve the accumulator object for a given inscription",
        "tags": [
          "Accumulator"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "inscription"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccountAccumulatorListLength/{address}": {
      "get": {
        "description": "Get the total number of accumulator entries for a specific Bitcoin address",
        "tags": [
          "Accumulator"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccountAccumulatorList/{address}": {
      "get": {
        "description": "Retrieve a list of accumulator records for a specified address",
        "tags": [
          "Accumulator"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "address"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getAccumulatorListLength": {
      "get": {
        "description": "Retrieve the total length of the accumulator list",
        "tags": [
          "Accumulator"
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getAccumulatorList": {
      "get": {
        "description": "Retrieve a list of accumulators",
        "tags": [
          "Accumulator"
        ],
        "parameters": [
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          }
        ],
        "responses": {
          "200": {
            "description": "Default Response"
          }
        }
      }
    },
    "/getListRecords": {
      "get": {
        "description": "Retrieve a batch of list records based on specified keys and limits",
        "tags": [
          "General"
        ],
        "parameters": [
          {
            "type": "string",
            "required": false,
            "in": "query",
            "name": "length_key"
          },
          {
            "type": "string",
            "required": false,
            "in": "query",
            "name": "iterator_key"
          },
          {
            "type": "integer",
            "default": 0,
            "required": false,
            "in": "query",
            "name": "offset"
          },
          {
            "type": "integer",
            "default": 500,
            "required": false,
            "in": "query",
            "name": "max"
          },
          {
            "type": "boolean",
            "default": true,
            "required": false,
            "in": "query",
            "name": "return_json"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/getLength/{length_key}": {
      "get": {
        "description": "Get the length of a list based on a specified key",
        "tags": [
          "General"
        ],
        "parameters": [
          {
            "type": "string",
            "required": true,
            "in": "path",
            "name": "length_key"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "description": "Successful response",
              "type": "object",
              "properties": {
                "result": {
                  "type": "number"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "schema": {
              "description": "Internal server error",
              "type": "object",
              "properties": {
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  },
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ]