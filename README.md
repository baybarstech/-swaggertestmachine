# API Test Machine

Service for automatic API testing based on Swagger/OpenAPI documentation.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Test Configuration](#test-configuration)
- [Swagger Requirements](#swagger-requirements)
- [Results Structure](#results-structure)
- [Additional Features](#additional-features)

## Installation

```bash
# Clone repository
git clone [repository-url]
cd testmashine

# Install dependencies
npm install

# or with yarn
yarn install
```

## Configuration

1. Create `.env` file in the root directory:
```env
API_HOST=http://localhost:3000
SWAGGER_PATH=/api/docs-json
BASE_API_URL=http://localhost:3000
```

2. Configure test settings in `test.config.json`:
```json
{
  "methods": {
    "GET": true,
    "POST": true,
    "PUT": true,
    "PATCH": true,
    "DELETE": false
  },
  "excludePaths": [
    "/api/health",
    "/api/metrics"
  ],
  "includeOnly": []
}
```

## Usage

```bash
# Run tests
npm start

# Build project
npm run build

# Run tests in development mode
npm run dev
```

## Test Configuration

### Methods
In `test.config.json` you can enable/disable testing of specific HTTP methods:
```json
{
  "methods": {
    "GET": true,    // will be tested
    "POST": false,  // will not be tested
    ...
  }
}
```

### Paths
- `excludePaths`: array of paths to exclude from testing
- `includeOnly`: array of paths to test (if empty, all paths are tested)

## Swagger Requirements

### Required Fields
- `paths`: endpoint descriptions
- `operationId`: unique operation identifier
- `parameters`: request parameters
- `responses`: expected responses

### Example of Proper Swagger Formatting
```json
{
  "paths": {
    "/api/users": {
      "get": {
        "operationId": "getUsers",
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer"
            },
            "example": 10
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
  }
}
```

### Formatting Recommendations
1. Provide data examples:
   ```json
   "example": {
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

2. Define response schemas:
   ```json
   "responses": {
     "200": {
       "content": {
         "application/json": {
           "schema": {
             "type": "object",
             "properties": {
               "id": {"type": "integer"},
               "name": {"type": "string"}
             }
           }
         }
       }
     }
   }
   ```

3. Specify authorization parameters:
   ```json
   "security": [
     {
       "bearerAuth": []
     }
   ]
   ```

## Results Structure

Test results are saved in the `results` directory in JSON format:

```json
{
  "summary": {
    "totalTests": 10,
    "successful": 8,
    "failed": 2,
    "successRate": "80%"
  },
  "failedTests": [
    {
      "path": "/api/users",
      "method": "POST",
      "operationId": "createUser",
      "error": "..."
    }
  ]
}
```

### Result Fields
- `totalTests`: total number of tests
- `successful`: number of successful tests
- `failed`: number of failed tests
- `successRate`: percentage of successful tests
- `failedTests`: array with information about failed tests

## Additional Features

### Debugging
For debugging use:
```bash
DEBUG=true npm start
```

### Parallel Execution
By default, tests are executed sequentially. For parallel execution add to `test.config.json`:
```json
{
  "parallel": true,
  "maxConcurrency": 5
}
```

### Error Handling
The service handles various types of errors:
- Connection errors
- Validation errors
- Timeout errors
- Authentication errors

### Reports
Test results are automatically saved with timestamps:
- JSON format for machine processing
- Console output for human reading
- Detailed error information for debugging

### Support
If you encounter problems:
1. Check configuration correctness
2. Ensure Swagger documentation meets requirements
3. Check console logs
4. Create an issue in repository

### Updates
Keep track of project updates and new features in the repository.

## Project Structure
```
testmashine/
├── src/
│   ├── config/
│   │   └── environment.ts
│   ├── services/
│   │   ├── ConfigService.ts
│   │   ├── SwaggerParser.ts
│   │   └── HttpMethodHandler.ts
│   ├── types/
│   │   ├── config.ts
│   │   └── swagger-doc.ts
│   └── index.ts
├── results/
├── test.config.json
├── .env
├── package.json
└── README.md
```

## Command Reference

### Basic Commands
```bash
# Install dependencies
npm install

# Run tests
npm start

# Build project
npm run build

# Run in development mode
npm run dev

# Clean results
npm run clean

# Run specific test suite
npm run test:suite [suite-name]
```

### Environment Variables
- `API_HOST`: Base URL of API server
- `SWAGGER_PATH`: Path to Swagger documentation
- `BASE_API_URL`: Base URL for API requests
- `DEBUG`: Enable debug mode (true/false)
- `TIMEOUT`: Request timeout in milliseconds

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details