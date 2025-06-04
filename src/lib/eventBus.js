import { EventEmitter } from 'events';

// Use global object to ensure we truly share across all contexts
const GLOBAL_KEY = '__astro_event_bus__';

if (!globalThis[GLOBAL_KEY]) {
  globalThis[GLOBAL_KEY] = new EventEmitter();
}

export const eventBus = globalThis[GLOBAL_KEY];