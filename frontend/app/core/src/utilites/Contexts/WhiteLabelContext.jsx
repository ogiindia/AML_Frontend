import { CONTEXT_PATH } from '@ais/utils';
import { createContext, useContext, useEffect, useState } from 'react';

const WhiteLabelContext = createContext();

// Default branding configuration
const DEFAULT_CONFIG = {
    appTitle: 'AIS',
    appDescription: 'AML Intelligence System',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#1e40af',
    secondaryColor: '#0369a1',
    accentColor: '#f59e0b',
    textColor: '#1f2937',
    launcherEnabled: true,
    theme: {
        borderRadius: '0.5rem',
        fontFamily: 'Inter, sans-serif',
    },
};

export const WhiteLabelProvider = ({ children }) => {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWhiteLabelConfig = async () => {
            try {
                setLoading(true);
                const response = await fetch(CONTEXT_PATH + '/whiteLabelConfig.json');

                if (!response.ok) {
                    throw new Error(`Failed to load config: ${response.status}`);
                }

                const whiteLabelConfig = await response.json();

                // Merge with defaults (allow partial override)
                const mergedConfig = {
                    ...DEFAULT_CONFIG,
                    ...whiteLabelConfig,
                    theme: {
                        ...DEFAULT_CONFIG.theme,
                        ...(whiteLabelConfig.theme || {}),
                    },
                };

                setConfig(mergedConfig);
                applyTheme(mergedConfig);
                setError(null);
            } catch (err) {
                console.warn('White label config not found, using defaults:', err.message);
                setConfig(DEFAULT_CONFIG);
                applyTheme(DEFAULT_CONFIG);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadWhiteLabelConfig();
    }, []);

    const applyTheme = (cfg) => {
        // Set CSS custom properties for dynamic theming
        const root = document.documentElement;
        root.style.setProperty('--color-primary', cfg.primaryColor);
        root.style.setProperty('--color-secondary', cfg.secondaryColor);
        root.style.setProperty('--color-accent', cfg.accentColor);
        root.style.setProperty('--color-text', cfg.textColor);
        root.style.setProperty('--border-radius', cfg.theme.borderRadius);
        root.style.setProperty('--font-family', cfg.theme.fontFamily);

        // Update document title
        document.title = cfg.appTitle;

        // Update favicon if provided
        if (cfg.faviconUrl) {
            const link = document.querySelector("link[rel='icon']");
            if (link) {
                link.href = cfg.faviconUrl;
            }
        }
    };

    const updateConfig = (newConfig) => {
        const updated = {
            ...config,
            ...newConfig,
            theme: {
                ...config.theme,
                ...(newConfig.theme || {}),
            },
        };
        setConfig(updated);
        applyTheme(updated);
    };

    return (
        <WhiteLabelContext.Provider value={{ config, loading, error, updateConfig }}>
            {children}
        </WhiteLabelContext.Provider>
    );
};

export const useWhiteLabel = () => {
    const context = useContext(WhiteLabelContext);
    if (!context) {
        throw new Error('useWhiteLabel must be used within WhiteLabelProvider');
    }
    return context;
};
