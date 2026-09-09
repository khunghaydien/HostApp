/**
 * TypeScript module declarations for federated remotes.
 * Runtime catalog lives in src/modules.ts — keep these in sync when adding a mini app.
 */
declare module 'interview/App' {
  import type { ComponentType } from 'react';

  const App: ComponentType;
  export default App;
}

declare module 'library/App' {
  import type { ComponentType } from 'react';

  const App: ComponentType;
  export default App;
}
