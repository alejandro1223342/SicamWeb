import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WARNING_TIME = 28 * 60 * 1000; // 28 minutes in ms
const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes in ms

export function useInactivityLogout() {
  const [showModal, setShowModal] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120); // 2 minutes warning
  const navigate = useNavigate();
  
  const logoutTimerRef = useRef<any>(null);
  const warningTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const handleLogout = useCallback(() => {
    navigate('/logout');
  }, [navigate]);

  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setShowModal(false);
    setRemainingSeconds(120);

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowModal(true);
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIME);

    // Set final logout timer
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, LOGOUT_TIME);
  }, [handleLogout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      if (!showModal) {
        resetTimers();
      }
    };

    // Initial timer setup
    resetTimers();

    // Add listeners
    events.forEach((event) => {
      document.addEventListener(event, activityHandler);
    });

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      
      events.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });
    };
  }, [resetTimers, showModal]);

  return {
    showModal,
    remainingSeconds,
    stayLoggedIn: resetTimers,
    logout: handleLogout
  };
}
