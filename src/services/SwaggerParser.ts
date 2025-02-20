import { EndpointConfig, EndpointHandler, Parameter, RequestBody } from '../types/swagger';
import { SwaggerDocument, SwaggerOperation } from '../types/swagger-doc';
import { ConfigService } from './ConfigService';
import { HttpMethod } from '../types/config';

export class SwaggerParser {
    private configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    parse(swaggerJson: SwaggerDocument): EndpointHandler {
        const endpoints: EndpointHandler = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: []
        };

        Object.entries(swaggerJson.paths).forEach(([path, methods]) => {
            // Check if this path should be tested
            if (!this.configService.shouldTestPath(path)) {
                return;
            }

            Object.entries(methods).forEach(([method, config]) => {
                const upperMethod = method.toUpperCase() as HttpMethod;
                
                // Check if this method is enabled in configuration
                if (this.configService.isMethodEnabled(upperMethod)) {
                    const endpointConfig = this.createEndpointConfig(
                        path, 
                        upperMethod, 
                        config as SwaggerOperation
                    );
                    endpoints[upperMethod].push(endpointConfig);
                }
            });
        });

        return endpoints;
    }

    private createEndpointConfig(path: string, method: string, config: SwaggerOperation): EndpointConfig {
        return {
            path,
            method,
            operationId: config.operationId || `${method}_${path}`,
            parameters: this.extractParameters(config),
            requestBody: this.extractRequestBody(config),
            successCode: this.getSuccessCode(config.responses),
            requiresAuth: this.checkAuthRequired(config)
        };
    }

    private extractParameters(config: SwaggerOperation): Parameter[] {
        const parameters = config.parameters || [];
        return parameters.map(param => ({
            name: param.name,
            required: param.required || false,
            in: param.in,
            type: param.schema?.type || 'string',
            example: param.example,
            schema: param.schema
        })) as Parameter[];
    }

    private extractRequestBody(config: SwaggerOperation): RequestBody | undefined {
        if (!config.requestBody?.content) return undefined;

        const content = config.requestBody.content;
        const contentType = Object.keys(content)[0];
        if (!contentType) return undefined;

        return {
            required: config.requestBody.required || false,
            contentType,
            schema: content[contentType].schema || {},
            example: content[contentType].example
        };
    }

    private getSuccessCode(responses?: SwaggerOperation['responses']): number {
        if (!responses) return 200;
        
        const successCodes = [200, 201, 202, 204];
        const availableCodes = Object.keys(responses).map(Number);
        return successCodes.find(code => availableCodes.includes(code)) || 200;
    }

    private checkAuthRequired(config: SwaggerOperation): boolean {
        return false;
    }
}