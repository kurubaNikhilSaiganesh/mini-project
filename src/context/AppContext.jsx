// ================================================================
// ALTS — AppContext
// Extracted from App.jsx to fix react-refresh lint warning.
// Single source of truth for all shared application state.
// ================================================================

import { createContext } from 'react';

export const AppContext = createContext(null);
