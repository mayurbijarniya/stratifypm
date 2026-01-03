import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { getSession } from '../../utils/authApi';
import { listConversations } from '../../utils/conversationApi';
import { Navigate } from 'react-router-dom';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { status, token, setAuth, setStatus, clearAuth } = useAuthStore();
  const { setConversations } = useAppStore();
  const hasValidated = useRef(false);
  const hasHydrated = useRef(false);

  // Wait for hydration
  useEffect(() => {
    const persistApi = useAuthStore.persist;
    if (!persistApi) {
      hasHydrated.current = true;
      return;
    }

    if (persistApi.hasHydrated()) {
      hasHydrated.current = true;
      return;
    }

    const unsub = persistApi.onFinishHydration(() => {
      hasHydrated.current = true;
    });
    return () => unsub?.();
  }, []);

  // Validate session in background - NO LOADING UI
  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      // Skip if already validated or no token
      if (hasValidated.current || !token) return;

      // Skip if already authenticated
      if (status === 'authenticated') return;

      hasValidated.current = true;
      setStatus('checking');

      try {
        const sessionUser = await getSession(null);
        if (!isMounted) return;

        setAuth(sessionUser.id, {
          ...sessionUser,
          createdAt: new Date(sessionUser.createdAt),
        });

        const conversations = await listConversations(token);
        if (!isMounted) return;

        setConversations(conversations);
      } catch {
        if (!isMounted) return;
        // Server validation failed - if we have a token, keep user logged in
        if (token) {
          setStatus('authenticated');
          listConversations(token)
            .then(convs => {
              if (isMounted) setConversations(convs);
            })
            .catch(() => {});
        } else {
          clearAuth();
        }
      }
    };

    // Wait for hydration then validate
    const timer = setTimeout(() => {
      if (hasHydrated.current) {
        validate();
      } else {
        const check = () => {
          if (hasHydrated.current) {
            validate();
          } else {
            setTimeout(check, 10);
          }
        };
        check();
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [token, status, setAuth, setStatus, clearAuth, setConversations]);

  // No token - redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Show app immediately - no loading screen
  // Validation happens silently in background
  return <>{children}</>;
};
