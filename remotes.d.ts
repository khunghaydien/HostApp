/**
 * TypeScript module declarations for federated remotes.
 * Runtime catalog lives in ./miniApps.ts — keep these in sync when adding a mini app.
 */
declare module 'miniApp/App' {
  import type { ComponentType } from 'react';

  const App: ComponentType;
  export default App;
}
