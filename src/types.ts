import { ProxyConfigurationOptions } from 'crawlee';

export interface Input {
    startUrls: string[];
    maxRequestsPerCrawl: number;
    proxyConfiguration: ProxyConfigurationOptions;
}