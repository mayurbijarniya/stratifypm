import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from './components/auth/AuthGate';
import { AboutPage } from './components/marketing/AboutPage';
import { LandingPage } from './components/marketing/LandingPage';
import { PrivacyPage } from './components/marketing/PrivacyPage';
import { AuthScreen } from './components/auth/AuthScreen';
import { useTheme } from './hooks/useTheme';
import { AppShell } from './components/app/AppShell';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/signin" element={<AuthScreen mode="signin" />} />
        <Route path="/signup" element={<AuthScreen mode="signup" />} />
        <Route
          path="/app"
          element={
            <AuthGate>
              <AppShell />
            </AuthGate>
          }
        />
        <Route
          path="/app/:conversationId"
          element={
            <AuthGate>
              <AppShell />
            </AuthGate>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
