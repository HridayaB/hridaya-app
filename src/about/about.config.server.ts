import { aboutConfig } from './about.config';

export const aboutServerConfig = {
  ...aboutConfig,
  meta: {
    ssrOptimized: true,
    lastUpdated: new Date().toISOString()
  }
};