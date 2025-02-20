export interface SwaggerPaths {
    [path: string]: {
        [method: string]: SwaggerOperation;
    };
}

export interface SwaggerOperation {
    operationId?: string;
    tags?: string[];
    parameters?: SwaggerParameter[];
    requestBody?: {
        content?: {
            [contentType: string]: {
                schema?: unknown;
                example?: unknown;
            };
        };
        required?: boolean;
    };
    responses?: {
        [code: string]: {
            description?: string;
            content?: {
                [contentType: string]: {
                    schema?: unknown;
                    example?: unknown;
                };
            };
        };
    };
}

export interface SwaggerParameter {
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    required?: boolean;
    schema?: {
        type?: string;
        format?: string;
        enum?: unknown[];
        [key: string]: unknown;
    };
    example?: unknown;
}

export interface SwaggerDocument {
    paths: SwaggerPaths;
    [key: string]: unknown;
}