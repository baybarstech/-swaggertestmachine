import axios, { AxiosInstance } from 'axios';
import { EndpointConfig, Parameter, TestResult } from '../types/swagger';

export class HttpMethodHandler {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000
    });
  }

  async handleGet(endpoint: EndpointConfig): Promise<TestResult> {
    try {
      const path = this.buildPath(endpoint.path, endpoint.parameters);
      const params = this.buildQueryParams(endpoint.parameters);
      
      const response = await this.client.get(path, { params });
      
      return {
        endpoint,
        success: response.status === endpoint.successCode,
        statusCode: response.status,
        response: response.data
      };
    } catch (error: any) {
      return {
        endpoint,
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async handlePost(endpoint: EndpointConfig): Promise<TestResult> {
    try {
      const path = this.buildPath(endpoint.path, endpoint.parameters);
      const body = this.buildRequestBody(endpoint.requestBody);
      
      const response = await this.client.post(path, body);
      
      return {
        endpoint,
        success: response.status === endpoint.successCode,
        statusCode: response.status,
        response: response.data
      };
    } catch (error: any) {
      return {
        endpoint,
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Аналогичные методы для PUT, PATCH, DELETE...

  private buildPath(path: string, parameters: Parameter[]): string {
    let result = path;
    const pathParams = parameters.filter(p => p.in === 'path');
    
    pathParams.forEach(param => {
      const value = param.example || this.generateDefaultValue(param);
      result = result.replace(`{${param.name}}`, value.toString());
    });

    return result;
  }

  private buildQueryParams(parameters: Parameter[]): Record<string, any> {
    const queryParams: Record<string, any> = {};
    const params = parameters.filter(p => p.in === 'query');

    params.forEach(param => {
      if (param.required || param.example) {
        queryParams[param.name] = param.example || this.generateDefaultValue(param);
      }
    });

    return queryParams;
  }

  private buildRequestBody(requestBody?: any): any {
    if (!requestBody) return {};
    
    if (requestBody.example) {
      return requestBody.example;
    }

    // Здесь можно добавить логику генерации тела запроса на основе схемы
    return {};
  }

  private generateDefaultValue(param: Parameter): any {
    switch (param.type) {
      case 'string':
        return 'test_string';
      case 'number':
        return 1;
      case 'boolean':
        return true;
      default:
        return 'test_value';
    }
  }
}