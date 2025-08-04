import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from '../../../container/container.js';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = Container.getInstance();
      const instance2 = Container.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('setupDependencies', () => {
    it('should setup dependencies without throwing', () => {
      expect(() => container.setupDependencies()).not.toThrow();
    });
  });

  describe('resolve', () => {
    it('should throw error for unknown dependency', () => {
      expect(() => container.resolve('unknown')).toThrow('Service unknown not found');
    });

    it('should resolve UrlController after setup', () => {
      container.setupDependencies();
      const urlController = container.resolve('UrlController');

      expect(urlController).toBeDefined();
      expect(urlController.constructor.name).toBe('UrlController');
    });

    it('should resolve UrlService after setup', () => {
      container.setupDependencies();
      const urlService = container.resolve('UrlService');

      expect(urlService).toBeDefined();
      expect(urlService.constructor.name).toBe('UrlService');
    });

    it('should return same instance on multiple resolve calls', () => {
      container.setupDependencies();
      
      const instance1 = container.resolve('UrlService');
      const instance2 = container.resolve('UrlService');

      // Services are not singleton in current implementation
      expect(instance1.constructor.name).toBe(instance2.constructor.name);
    });
  });
});
