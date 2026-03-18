import { useEffect, useState } from 'react';
import { getBrandingConfig, getBrandingValue } from './BrandingLoader';

// Helper: convert camelCase to kebab-case
function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Helper: convert dot.path like 'assets.login.backgroundImage' -> 'assets-login-background-image'
function pathToCssVarName(path) {
    return path
        .split('.')
        .map((seg) => camelToKebab(seg))
        .join('-');
}

// Helper: resolve image URL with context path similar to BrandingLoader
function resolveUrl(original) {
    const contextPath = typeof __CONTEXT_PATH__ !== 'undefined' ? __CONTEXT_PATH__ : '';
    if (!original) return original;
    if (original.startsWith('http')) return original;
    if (original.startsWith('./') || original.startsWith('../')) return original;
    if (original.startsWith('/')) return contextPath + original;
    return original;
}

// Helper: detect image filename by extension
function looksLikeImage(str) {
    return /\.(png|jpe?g|gif|svg|ico|webp|avif)(\?.*)?$/i.test(str);
}

/**
 * Hook to access branding configuration in React components
 * @returns {Object} The branding configuration
 *
 * @example
 * const branding = useBranding();
 * console.log(branding.appTitle);
 * console.log(branding.colors.primary);
 */
export function useBranding() {
    const [config, setConfig] = useState(getBrandingConfig());

    useEffect(() => {
        // Check if config was loaded (window.__BRANDING_CONFIG__ is set)
        const checkConfig = () => {
            const loadedConfig = getBrandingConfig();
            setConfig(loadedConfig);
        };

        checkConfig();
        // Poll for config to be loaded (in case this hook is used before initialization completes)
        const interval = setInterval(checkConfig, 100);
        const timeout = setTimeout(() => clearInterval(interval), 5000); // Stop polling after 5 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return config;
}

/**
 * Hook to get a specific branding value
 * @param {string} path - The dot-separated path to the value (e.g., 'colors.primary')
 * @param {*} defaultValue - The default value if not found
 * @returns {*} The branding value
 *
 * @example
 * const primaryColor = useBrandingValue('colors.primary');
 * const appTitle = useBrandingValue('appTitle', 'Default App');
 */
export function useBrandingValue(path, defaultValue = null) {
    // Internal function to produce a normalized return value
    const normalize = (raw) => {
        if (typeof raw !== 'string') return raw ?? defaultValue;

        // If the path points into assets, return the CSS variable reference
        // (single transformed value). This keeps usage consistent across UI.
        const isAssetPath = path && path.split('.')[0] === 'assets';
        if (isAssetPath) {
            // Return resolved URL string for assets so components can use it directly
            return resolveUrl(raw) || defaultValue;
        }

        // If it looks like an image filename but not under `assets`, return resolved URL
        if (looksLikeImage(raw)) {
            return resolveUrl(raw);
        }

        return raw;
    };

    const [value, setValue] = useState(() => normalize(getBrandingValue(path, defaultValue)));

    useEffect(() => {
        const checkValue = () => {
            setValue(normalize(getBrandingValue(path, defaultValue)));
        };

        checkValue();
        const interval = setInterval(checkValue, 100);
        const timeout = setTimeout(() => clearInterval(interval), 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [path, defaultValue]);

    return value;
}
