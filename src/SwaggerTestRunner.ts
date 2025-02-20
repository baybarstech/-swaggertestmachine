import { SwaggerParser } from './services/SwaggerParser';
import { HttpMethodHandler } from './services/HttpMethodHandler';
import { EndpointConfig, TestResult } from './types/swagger';
import { SwaggerDocument } from './types/swagger-doc';

export class SwaggerTestRunner {
  private parser: SwaggerParser;
  private handler: HttpMethodHandler;

  constructor(baseURL: string) {
    this.parser = new SwaggerParser();
    this.handler = new HttpMethodHandler(baseURL);
  }

  async runTests(swaggerJson: SwaggerDocument) {
    const endpoints = this.parser.parse(swaggerJson);
    const results = {
      success: [] as TestResult[],
      failed: [] as TestResult[]
    };

    // GET tests
    for (const endpoint of endpoints.GET) {
      try {
        const result = await this.handler.handleGet(endpoint);
        if (result.success) {
          results.success.push(result);
        } else {
          results.failed.push(result);
        }
      } catch (error) {
        results.failed.push({
          endpoint,
          success: false,
          error
        });
      }
    }

    // POST tests
    for (const endpoint of endpoints.POST) {
      try {
        const result = await this.handler.handlePost(endpoint);
        if (result.success) {
          results.success.push(result);
        } else {
          results.failed.push(result);
        }
      } catch (error) {
        results.failed.push({
          endpoint,
          success: false,
          error
        });
      }
    }

    // PUT tests
    for (const endpoint of endpoints.PUT) {
      try {
        const result = await this.handler.handlePost(endpoint);
        if (result.success) {
          results.success.push(result);
        } else {
          results.failed.push(result);
        }
      } catch (error) {
        results.failed.push({
          endpoint,
          success: false,
          error
        });
      }
    }

    // DELETE tests
    for (const endpoint of endpoints.DELETE) {
      try {
        const result = await this.handler.handlePost(endpoint);
        if (result.success) {
          results.success.push(result);
        } else {
          results.failed.push(result);
        }
      } catch (error) {
        results.failed.push({
          endpoint,
          success: false,
          error
        });
      }
    }

    return this.generateReport(results);
  }

  private generateReport(results: { success: TestResult[], failed: TestResult[] }) {
    const totalTests = results.success.length + results.failed.length;
    const successRate = (results.success.length / totalTests) * 100;

    return {
      summary: {
        totalTests,
        successful: results.success.length,
        failed: results.failed.length,
        successRate: `${successRate.toFixed(2)}%`
      },
      successfulTests: results.success.map(result => ({
        path: result.endpoint.path,
        method: result.endpoint.method,
        statusCode: result.statusCode,
        operationId: result.endpoint.operationId
      })),
      failedTests: results.failed.map(result => ({
        path: result.endpoint.path,
        method: result.endpoint.method,
        error: result.error,
        operationId: result.endpoint.operationId
      }))
    };
  }
}