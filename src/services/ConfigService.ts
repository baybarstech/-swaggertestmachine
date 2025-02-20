import { TestConfig, HttpMethod } from '../types/config';
import * as fs from 'fs';
import * as path from 'path';

export class ConfigService {
    private config: TestConfig;

    constructor() {
        const configPath = path.join(process.cwd(), 'test.config.json');
        if (!fs.existsSync(configPath)) {
            throw new Error('Configuration file test.config.json not found!');
        }
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }

    isMethodEnabled(method: HttpMethod): boolean {
        return this.config.methods[method] === true;
    }

    shouldTestPath(path: string): boolean {
        // If specific paths are provided for testing, check only them
        if (this.config.includeOnly.length > 0) {
            return this.config.includeOnly.some(includePath => path.startsWith(includePath));
        }
        
        // Otherwise check if the path is excluded
        return !this.config.excludePaths.some(excludePath => path.startsWith(excludePath));
    }

    getEnabledMethods(): HttpMethod[] {
        return Object.entries(this.config.methods)
            .filter(([_, enabled]) => enabled)
            .map(([method]) => method as HttpMethod);
    }
}