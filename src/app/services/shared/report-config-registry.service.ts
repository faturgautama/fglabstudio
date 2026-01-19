import { Injectable } from '@angular/core';
import { ReportConfig } from '../../model/shared/report.model';

@Injectable({ providedIn: 'root' })
export class ReportConfigRegistryService {
    private configs = new Map<string, ReportConfig>();

    registerConfig(config: ReportConfig): void {
        this.configs.set(config.type, config);
    }

    registerConfigs(configs: ReportConfig[]): void {
        configs.forEach(config => this.registerConfig(config));
    }

    getConfig(type: string): ReportConfig {
        const config = this.configs.get(type);
        if (!config) {
            throw new Error(`Report configuration not found for type: ${type}`);
        }
        return config;
    }

    getAllTypes(): string[] {
        return Array.from(this.configs.keys());
    }

    getAllConfigs(): ReportConfig[] {
        return Array.from(this.configs.values());
    }

    hasConfig(type: string): boolean {
        return this.configs.has(type);
    }
}
