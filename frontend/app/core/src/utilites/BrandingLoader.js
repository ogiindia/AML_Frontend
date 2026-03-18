/**
 * Branding Configuration Loader
 * Loads white-label configuration from public/branding-config.json
 * and applies CSS variables to the document root
 */

import { CONTEXT_PATH } from "@ais/utils";

// Default branding configuration (fallback)
const DEFAULT_BRANDING_CONFIG = {
    appTitle: 'AIS - Application',
    appName: 'AIS',
    assets: {
        logo: './logo.png',
        favicon: './favicon.ico',
        login: {
            backgroundImage: './bg1.png',
        },
    },
    colors: {
        primary: 'oklch(0.537 0.1498 252.08)',
        primaryForeground: 'oklch(0.982 0.018 155.826)',
        secondary: 'oklch(0.967 0.001 286.375)',
        secondaryForeground: 'oklch(0.21 0.006 285.885)',
        accent: 'oklch(0.967 0.001 286.375)',
        accentForeground: 'oklch(0.21 0.006 285.885)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.141 0.005 285.823)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.141 0.005 285.823)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.141 0.005 285.823)',
        muted: 'oklch(0.967 0.001 286.375)',
        mutedForeground: 'oklch(0.552 0.016 285.938)',
        destructive: 'oklch(0.577 0.245 27.325)',
        border: 'oklch(0.92 0.004 286.32)',
        input: 'oklch(0.92 0.004 286.32)',
        ring: 'oklch(0.537 0.1498 252.08)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(0.985 0 0)',
        sidebarForeground: 'oklch(0.141 0.005 285.823)',
        sidebarPrimary: 'oklch(0.537 0.1498 252.08)',
        sidebarPrimaryForeground: 'oklch(0.982 0.018 155.826)',
        sidebarAccent: 'oklch(0.967 0.001 286.375)',
        sidebarAccentForeground: 'oklch(0.21 0.006 285.885)',
        sidebarBorder: 'oklch(0.92 0.004 286.32)',
        sidebarRing: 'oklch(0.537 0.1498 252.08)',
    },
    darkColors: {
        primary: 'oklch(0.696 0.17 162.48)',
        primaryForeground: 'oklch(0.393 0.095 152.535)',
        secondary: 'oklch(0.274 0.006 286.033)',
        secondaryForeground: 'oklch(0.985 0 0)',
        accent: 'oklch(0.274 0.006 286.033)',
        accentForeground: 'oklch(0.985 0 0)',
        background: 'oklch(0.141 0.005 285.823)',
        foreground: 'oklch(0.985 0 0)',
        card: 'oklch(0.21 0.006 285.885)',
        cardForeground: 'oklch(0.985 0 0)',
        popover: 'oklch(0.21 0.006 285.885)',
        popoverForeground: 'oklch(0.985 0 0)',
        muted: 'oklch(0.274 0.006 286.033)',
        mutedForeground: 'oklch(0.705 0.015 286.067)',
        destructive: 'oklch(0.704 0.191 22.216)',
        border: 'oklch(1 0 0 / 10%)',
        input: 'oklch(1 0 0 / 15%)',
        ring: 'oklch(0.527 0.154 150.069)',
        chart1: 'oklch(0.488 0.243 264.376)',
        chart2: 'oklch(0.696 0.17 162.48)',
        chart3: 'oklch(0.769 0.188 70.08)',
        chart4: 'oklch(0.627 0.265 303.9)',
        chart5: 'oklch(0.645 0.246 16.439)',
        sidebar: 'oklch(0.21 0.006 285.885)',
        sidebarForeground: 'oklch(0.985 0 0)',
        sidebarPrimary: 'oklch(0.696 0.17 162.48)',
        sidebarPrimaryForeground: 'oklch(0.393 0.095 152.535)',
        sidebarAccent: 'oklch(0.274 0.006 286.033)',
        sidebarAccentForeground: 'oklch(0.985 0 0)',
        sidebarBorder: 'oklch(1 0 0 / 10%)',
        sidebarRing: 'oklch(0.527 0.154 150.069)',
    },
    radius: '0.65rem',

};

/**
 * Convert camelCase to kebab-case for CSS variable names
 * @param {string} str - The string to convert
 * @returns {string} - The kebab-case string
 */
function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Load and apply branding configuration
 * @returns {Promise<Object>} - The loaded configuration
 */
async function loadBrandingConfig() {
    try {
        const response = await fetch(CONTEXT_PATH + '/branding-config.json');
        if (!response.ok) {
            console.warn('Branding config not found, using defaults');
            return DEFAULT_BRANDING_CONFIG;
        }
        const config = await response.json();
        // Merge with defaults to ensure all required properties exist
        return {
            ...DEFAULT_BRANDING_CONFIG,
            ...config,
            colors: { ...DEFAULT_BRANDING_CONFIG.colors, ...config.colors },
            darkColors: { ...DEFAULT_BRANDING_CONFIG.darkColors, ...config.darkColors },
        };
    } catch (error) {
        console.warn('Error loading branding config:', error);
        return DEFAULT_BRANDING_CONFIG;
    }
}

/**
 * Apply assets (images) as CSS variables dynamically
 * Recursively processes all image paths in assets and creates CSS variables
 * Automatically handles context paths for relative URLs
 * @param {Object} config - The branding configuration
 */
function applyAssetImages(config) {
    const root = document.documentElement;

    if (!config.assets) return;

    // Get context path from global define or empty string
    const contextPath = CONTEXT_PATH || '';

    /**
     * Process image path to include context path if needed
     * @param {string} imagePath - The original image path
     * @returns {string} - Processed path with context if applicable
     */
    const processImagePath = (imagePath) => {
        // If it's an absolute URL, use as-is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // If it's a relative path (./ or ../) or absolute with context
        if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
            // Relative paths stay as-is (browser resolves them)
            return imagePath;
        }

        // If it starts with /, prepend context path
        if (imagePath.startsWith('/')) {
            return contextPath + imagePath;
        }

        // Default: return as-is
        return imagePath;
    };

    /**
     * Recursively traverse assets object and apply images as CSS variables
     * @param {Object} obj - Object to traverse
     * @param {string} prefix - Current prefix for CSS variable name
     */
    const traverseAssets = (obj, prefix = 'assets') => {
        Object.entries(obj).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            // Check if value is a string (potential image path)
            if (typeof value === 'string') {
                const cssVariableName = `--${camelToKebab(prefix)}-${camelToKebab(key)}`;
                // Process path and wrap in url()
                const processedPath = processImagePath(value);
                const cssValue = `url('${processedPath}')`;
                root.style.setProperty(cssVariableName, cssValue);
            }
            // Recursively handle nested objects
            else if (typeof value === 'object' && !Array.isArray(value)) {
                traverseAssets(value, `${prefix}-${camelToKebab(key)}`);
            }
        });
    };

    traverseAssets(config.assets);
}

/**
 * Apply CSS variables to the document root based on branding config
 * @param {Object} config - The branding configuration
 */
function applyCSSVariables(config) {
    const root = document.documentElement;

    // Apply assets (images) dynamically
    applyAssetImages(config);

    // Apply light mode colors
    if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
            const cssVariableName = `--${camelToKebab(key)}`;
            root.style.setProperty(cssVariableName, value);
        });
    }

    // Apply dark mode colors
    const darkElement = document.querySelector('.dark') || document.documentElement;
    if (config.darkColors) {
        const darkStyles = {};
        Object.entries(config.darkColors).forEach(([key, value]) => {
            const cssVariableName = `--${camelToKebab(key)}`;
            darkStyles[cssVariableName] = value;
        });

        // Apply dark mode styles
        Object.entries(darkStyles).forEach(([key, value]) => {
            if (document.querySelector('.dark')) {
                document.querySelector('.dark').style.setProperty(key, value);
            } else {
                // Create a style tag for dark mode if no dark element exists
                const styleTag = document.createElement('style');
                styleTag.textContent = `.dark { ${Object.entries(darkStyles)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('; ')} }`;
                document.head.appendChild(styleTag);
            }
        });
    }

    // Apply radius
    if (config.radius) {
        root.style.setProperty('--radius', config.radius);
    }
}

/**
 * Update document title and favicon based on branding config
 * @param {Object} config - The branding configuration
 */
function updateDocumentMetadata(config) {
    // Update page title
    if (config.appTitle) {
        document.title = config.appTitle;
    }

    // Update favicon if specified
    if (config.assets?.favicon) {
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
        }
        faviconLink.href = config.assets.favicon;
    }

    // Update logo if needed (for custom implementations)
    if (config.assets?.logo) {
        // This can be used by components to get the logo URL
        window.__BRANDING_LOGO__ = config.assets.logo;
    }
}

/**
 * Initialize branding by loading config and applying styles
 * @returns {Promise<Object>} - The loaded configuration
 */
export async function initializeBranding() {
    const config = await loadBrandingConfig();
    applyCSSVariables(config);
    updateDocumentMetadata(config);

    // Store config globally for components that might need it
    window.__BRANDING_CONFIG__ = config;

    return config;
}

/**
 * Get the branding configuration from window object
 * @returns {Object} - The branding configuration
 */
export function getBrandingConfig() {
    return window.__BRANDING_CONFIG__ || DEFAULT_BRANDING_CONFIG;
}

/**
 * Get a specific branding value by path (e.g., 'colors.primary')
 * @param {string} path - The dot-separated path to the value
 * @param {*} defaultValue - The default value if path is not found
 * @returns {*} - The branding value
 */
export function getBrandingValue(path, defaultValue = null) {
    const config = getBrandingConfig();
    return path.split('.').reduce((obj, key) => obj?.[key], config) ?? defaultValue;
}
