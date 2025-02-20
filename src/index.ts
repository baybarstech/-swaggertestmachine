import { SwaggerTestRunner } from './SwaggerTestRunner';
import { config } from './config/environment';
import { SwaggerDocument } from './types/swagger-doc';
import { ConfigService } from './services/ConfigService';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

async function fetchSwaggerDoc(): Promise<SwaggerDocument> {
    try {
        const response = await axios.get<SwaggerDocument>(config.swaggerUrl);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching Swagger documentation:', {
                status: error.response?.status,
                message: error.message
            });
        } else {
            console.error('Unexpected error:', error);
        }
        throw new Error('Failed to fetch Swagger documentation');
    }
}

interface TestResults {
    summary: {
        totalTests: number;
        successful: number;
        failed: number;
        successRate: string;
    };
    failedTests: Array<{
        path: string;
        method: string;
        operationId: string;
        error: unknown;
    }>;
}

async function main() {
    try {
        const configService = new ConfigService();
        const enabledMethods = configService.getEnabledMethods();

        console.log('\nEnabled HTTP Methods:');
        console.log('====================');
        Object.entries(configService['config'].methods).forEach(([method, enabled]) => {
            console.log(`${method}: ${enabled ? '✅' : '❌'}`);
        });

        console.log('\nFetching Swagger documentation from:', config.swaggerUrl);
        const swaggerJson = await fetchSwaggerDoc();

        const runner = new SwaggerTestRunner(config.baseApiUrl);
        console.log('\nStarting API tests...');
        const results = await runner.runTests(swaggerJson) as TestResults;

        console.log('\nTest Results Summary:');
        console.log('======================');
        console.log(`Total Tests: ${results.summary.totalTests}`);
        console.log(`Successful: ${results.summary.successful}`);
        console.log(`Failed: ${results.summary.failed}`);
        console.log(`Success Rate: ${results.summary.successRate}`);

        if (results.failedTests.length > 0) {
            console.log('\nFailed Tests:');
            console.log('=============');
            results.failedTests.forEach(test => {
                console.log(`\nPath: ${test.path}`);
                console.log(`Method: ${test.method}`);
                console.log(`Operation: ${test.operationId}`);
                console.log(`Error: ${JSON.stringify(test.error, null, 2)}`);
            });
        }

        const resultsDir = path.join(__dirname, '..', 'results');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }

        const date = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const filename = `test-results-${date}.json`;
        
        fs.writeFileSync(
            path.join(resultsDir, filename),
            JSON.stringify(results, null, 2)
        );

        console.log(`\nResults saved to: ${filename}`);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error running tests:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        process.exit(1);
    }
}

main();