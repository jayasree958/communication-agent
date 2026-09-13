import React, { useState } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { Navbar } from './components/Navbar';
import { SecurityBanner } from './components/SecurityBanner';
import { SessionHUD } from './components/LiveSession/SessionHUD';
import { PostSessionReport } from './components/Analysis/PostSessionReport';
import { ProgressDashboard } from './components/Progress/ProgressDashboard';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'session' | 'progress'>('session');
  const { sessionState } = useSession();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <SecurityBanner />

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {currentTab === 'session' ? (
          sessionState === 'report' ? (
            <PostSessionReport />
          ) : (
            <SessionHUD />
          )
        ) : (
          <ProgressDashboard />
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <MainAppContent />
    </SessionProvider>
  );
};

export default App;
