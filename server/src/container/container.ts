import { UrlService } from '../services/url-service.js';
import { UrlController } from '../controllers/url-controller.js';
import type { IUrlService } from '../interfaces/url-service.interface.js';
import type { IUrlController } from '../interfaces/url-controller.interface.js';

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not found`);
    }
    return factory();
  }

  setupDependencies(): void {
    this.register<IUrlService>('UrlService', () => new UrlService());
    
    this.register<IUrlController>('UrlController', () => {
      const urlService = this.resolve<IUrlService>('UrlService');
      return new UrlController(urlService);
    });
  }
}
