import { useState } from 'react';

import { HomeScreen } from './components/HomeScreen';
import { MiniAppScreen } from './components/MiniAppScreen';
import type { MiniAppConfig } from './miniApps';

export default function App() {
  const [activeMiniApp, setActiveMiniApp] = useState<MiniAppConfig | null>(null);

  if (activeMiniApp) {
    return (
      <MiniAppScreen
        miniApp={activeMiniApp}
        onClose={() => setActiveMiniApp(null)}
      />
    );
  }

  return <HomeScreen onOpenMiniApp={setActiveMiniApp} />;
}
