// app/layout.js
'use client'; // This directive is crucial for client-side components

import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './utils/createEmotionCache';

// Create a client-side cache for Emotion
const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <Head>
            <title>Google Flights Clone</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            {/* Add any additional head elements here */}
        </Head>
        <body>
        <CacheProvider value={clientSideEmotionCache}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
        </body>
        </html>
    );
}

