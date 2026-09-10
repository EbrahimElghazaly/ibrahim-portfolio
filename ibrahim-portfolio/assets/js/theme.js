/* ============================================================
   THEME.JS — Dark / Light Mode Toggle
   Persists choice in localStorage + respects system preference
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const THEME_KEY = 'portfolio-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    let toggleButton = null;
    let currentTheme = DARK;
    let mediaQuery = null;

    /* ============================================================
       2. GET INITIAL THEME
       Priority: localStorage > system preference > default (dark)
       ============================================================ */
    function getInitialTheme() {
        // 1. Check localStorage
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === DARK || stored === LIGHT) {
            return stored;
        }

        // 2. Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return LIGHT;
        }

        // 3. Default
        return DARK;
    }

    /* ============================================================
       3. APPLY THEME
       Sets data-theme attribute on <html> + updates meta theme-color
       ============================================================ */
    function applyTheme(theme) {
        currentTheme = theme;

        const html = document.documentElement;

        if (theme === LIGHT) {
            html.setAttribute('data-theme', LIGHT);
        } else {
            html.removeAttribute('data-theme');
        }

        // Update meta theme-color (mobile browser bar color)
        updateMetaThemeColor(theme);

        // Update ARIA label on toggle
        if (toggleButton) {
            toggleButton.setAttribute(
                'aria-label',
                theme === LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
            );
            toggleButton.setAttribute('aria-pressed', theme === LIGHT ? 'true' : 'false');
        }

        // Dispatch event for other modules
        document.dispatchEvent(new CustomEvent('theme:changed', {
            detail: { theme }
        }));
    }

    /* ============================================================
       4. UPDATE META THEME-COLOR
       ============================================================ */
    function updateMetaThemeColor(theme) {
        let meta = document.querySelector('meta[name="theme-color"]');

        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }

        meta.content = theme === LIGHT ? '#f8fafc' : '#0a0e27';
    }

    /* ============================================================
       5. TOGGLE THEME
       ============================================================ */
    function toggleTheme() {
        const newTheme = currentTheme === DARK ? LIGHT : DARK;

        // Add transition class to avoid flash
        document.documentElement.classList.add('theme-transitioning');

        applyTheme(newTheme);

        // Save preference
        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (e) {
            console.warn('[Theme] Could not save preference:', e);
        }

        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 400);
    }

    /* ============================================================
       6. WATCH SYSTEM PREFERENCE
       Only applies if user hasn't manually chosen a theme
       ============================================================ */
    function watchSystemPreference() {
        if (!window.matchMedia) return;

        mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handler = (e) => {
            // Only follow system if user hasn't set a preference
            const stored = localStorage.getItem(THEME_KEY);
            if (stored) return;

            applyTheme(e.matches ? LIGHT : DARK);
        };

        // Modern API
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler);
        } else if (mediaQuery.addListener) {
            // Older Safari
            mediaQuery.addListener(handler);
        }
    }

    /* ============================================================
       7. KEYBOARD SHORTCUT
       Press "T" to toggle theme (when not typing)
       ============================================================ */
    function initKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input/textarea
            const target = e.target;
            const isTyping =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isTyping) return;

            // Ignore if modifier keys are pressed
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

            if (e.key === 't' || e.key === 'T') {
                toggleTheme();
            }
        });
    }

    /* ============================================================
       8. INIT
       ============================================================ */
    function initTheme() {
        toggleButton = document.getElementById('themeToggle');

        // 1. Apply initial theme immediately (prevent FOUC)
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme);

        // 2. Attach click listener
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }

        // 3. Watch system preference changes
        watchSystemPreference();

        // 4. Keyboard shortcut
        initKeyboardShortcut();

        return {
            get: () => currentTheme,
            toggle: toggleTheme,
            set: applyTheme
        };
    }

    /* ============================================================
       9. EXPOSE GLOBALLY
       ============================================================ */
    window.initTheme = initTheme;

    // Expose API for other modules
    window.ThemeAPI = {
        get: () => currentTheme,
        toggle: toggleTheme,
        set: (theme) => {
            if (theme === DARK || theme === LIGHT) {
                applyTheme(theme);
                try {
                    localStorage.setItem(THEME_KEY, theme);
                } catch (e) {}
            }
        }
    };

})();