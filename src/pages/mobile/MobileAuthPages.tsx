import React from 'react';
import { AuthPages } from '../AuthPages';

export const MobileAuthPages: React.FC<{
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'otp';
}> = ({ initialMode = 'login' }) => {
  return <AuthPages initialMode={initialMode} />;
};
