export interface EndpointConfig {
    path: string;
    method: string;
    operationId: string;
    parameters: Parameter[];
    requestBody?: RequestBody;
    successCode: number;
    requiresAuth: boolean;
}

export interface Parameter {
    name: string;
    required: boolean;
    in: 'query' | 'path' | 'header' | 'cookie';
    type: string;
    example?: unknown;
    schema?: {
        type?: string;
        format?: string;
        enum?: unknown[];
        [key: string]: unknown;
    };
}

export interface RequestBody {
    required: boolean;
    contentType: string;
    schema: unknown;
    example?: unknown;
}

export interface TestResult {
    endpoint: EndpointConfig;
    success: boolean;
    statusCode?: number;
    error?: unknown;
    response?: unknown;
}

export interface EndpointHandler {
    GET: EndpointConfig[];
    POST: EndpointConfig[];
    PUT: EndpointConfig[];
    PATCH: EndpointConfig[];
    DELETE: EndpointConfig[];
}