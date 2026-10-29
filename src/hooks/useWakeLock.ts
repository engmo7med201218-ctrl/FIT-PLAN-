import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Safe catch
      } finally {
        wakeLockRef.current = null;
        setIsActive(false);
      }
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return false;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false);
      });
      setIsActive(true);
      return true;
    } catch {
      setIsActive(false);
      return false;
    }
  }, []);

  const toggleWakeLock = useCallback(async () => {
    if (isActive) {
      await releaseWakeLock();
      return false;
    } else {
      return await requestWakeLock();
    }
  }, [isActive, releaseWakeLock, requestWakeLock]);

  // Re-acquire lock if tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, [isActive, requestWakeLock]);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
    toggleWakeLock,
  };
}
