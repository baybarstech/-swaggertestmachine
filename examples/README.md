# NestJS Swagger Documentation Example

This example demonstrates best practices for documenting NestJS APIs using Swagger/OpenAPI.

## Key Features

1. **Comprehensive Documentation**
   - All endpoints are fully documented
   - Clear descriptions for operations
   - Detailed parameter descriptions
   - Response schemas and examples
   - Error handling documentation

2. **Type Safety**
   - Strong TypeScript typing
   - DTO validation using class-validator
   - Swagger decorators for schema generation

3. **Best Practices**
   - Grouped by tags
   - Bearer token authentication
   - Paginated responses
   - Proper error responses
   - Multiple examples for requests

## Setup

1. Install required dependencies:
```bash
npm install @nestjs/swagger swagger-ui-express class-validator class-transformer
```

2. Update main.ts:
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User management API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
```

## Documentation Structure

### 1. Controller Decorators
```typescript
@ApiTags('Users')            // Group endpoints
@ApiBearerAuth()            // Authentication
@ApiExtraModels(...)        // Register DTOs
```

### 2. Endpoint Decorators
```typescript
@ApiOperation({})           // Endpoint description
@ApiResponse({})           // Response documentation
@ApiParam({})              // Path parameters
@ApiQuery({})              // Query parameters
@ApiBody({})               // Request body
```

### 3. DTO Decorators
```typescript
@ApiProperty({})           // Required properties
@ApiPropertyOptional({})   // Optional properties
```

### 4. Validation Decorators
```typescript
@IsEmail()                 // Validate email
@IsString()               // Validate string
@MinLength(8)             // Minimum length
@IsEnum(UserRole)         // Enum validation
```

## Best Practices

1. **Use Clear Descriptions**
   - Write clear, concise descriptions
   - Include example values
   - Document all possible responses

2. **Proper Error Handling**
   - Document all error responses
   - Include error codes and messages
   - Provide error examples

3. **Type Safety**
   - Use TypeScript interfaces/classes
   - Add validation rules
   - Define response types

4. **Examples**
   - Provide realistic examples
   - Include multiple scenarios
   - Show both success and error cases

5. **Authentication**
   - Document security requirements
   - Show token format
   - Include auth error responses

6. **Pagination**
   - Document page parameters
   - Show pagination response format
   - Include default values

## Generated Documentation

The example will generate comprehensive API documentation including:

- API endpoints grouped by tags
- Request/response schemas
- Authentication requirements
- Validation rules
- Examples for requests and responses
- Error scenarios
- Pagination details

## Testing

The generated documentation can be accessed at:
```
http://localhost:3000/api/docs
```

## Additional Tips

1. **Version Control**
   - Include API version in URL
   - Document breaking changes
   - Maintain backwards compatibility

2. **Security**
   - Document rate limits
   - Show permission requirements
   - Include security warnings

3. **Maintenance**
   - Keep documentation updated
   - Review and update examples
   - Check for deprecated features