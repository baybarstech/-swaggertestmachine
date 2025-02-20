export interface TestConfig {
    methods: {
        GET: boolean;
        POST: boolean;
        PUT: boolean;
        PATCH: boolean;
        DELETE: boolean;
    };
    excludePaths: string[];
    includeOnly: string[];
}

export type HttpMethod = keyof TestConfig['methods'];