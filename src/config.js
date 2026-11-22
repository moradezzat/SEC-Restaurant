// Default settings for the application
export const DEFAULT_LANGUAGE = 'ar';
export const DEFAULT_THEME = 'light';

// The SEC Manager backend (see .env.local.example)
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
