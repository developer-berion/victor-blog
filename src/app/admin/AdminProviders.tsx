'use client';

import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { adminTheme } from './theme';

export default function AdminProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={adminTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          {children}
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
