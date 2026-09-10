/* ============================================================
   MAIN.JS — Entry Point
   Initializes all modules after DOM is ready
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. UTILITIES (Global Helpers)
       ============================================================ */
    const Utils = {
        // Select single element
        $: (selector, context = document) => context.querySelector(selector),

        // Select multiple elements
        $$: (selector, context = document) => [...context.querySelectorAll(selector)],

        // Add event listener
        on: (el, event, handler, options = {}) => {
            if (el) el.addEventListener(event, handler, options);
        },

        // Throttle function (for scroll/resize)
        throttle: (fn, delay = 100) => {
            let last = 0;
            return function (...args) {
                const now = Date.now();
                if (now - last >= delay) {
                    last = now;
                    fn.apply(this, args);
                }
            };
        },

        // Debounce function
        debounce: (fn, delay = 200) => {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        // Clamp value between min and max
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),

        // Linear interpolation
        lerp: (start, end, amount) => start + (end - start) * amount,

        // Random number between min and max
        random: (min, max) => Math.random() * (max - min) + min,

        // Check if element is in viewport
        isInViewport: (el, offset = 0) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top < window.innerHeight - offset &&
                rect.bottom > offset
            );
        },

        // Check if device is touch
        isTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,

        // Check if user prefers reduced motion
        prefersReducedMotion: () =>
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,

        // Smooth scroll to element
        scrollTo: (target, offset = 80) => {
            const el = typeof target === 'string'
                ? document.querySelector(target)
                : target;
            if (!el) return;

            const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        },

        // Wait for images to load
        waitForImages: (container = document) => {
            const images = [...container.querySelectorAll('img')];
            return Promise.all(
                images.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    });
                })
            );
        },

        // Format date
        formatDate: (date) => {
            const d = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return d.toLocaleDateString('en-US', options);
        }
    };

    // Expose Utils globally
    window.Utils = Utils;

    /* ============================================================
       2. APP STATE
       ============================================================ */
    const AppState = {
        isLoaded: false,
        isMobile: window.innerWidth <= 1024,
        currentSection: 'home',
        theme: localStorage.getItem('theme') || 'dark',
        scrollY: 0,
        mouseX: 0,
        mouseY: 0
    };

    window.AppState = AppState;

    /* ============================================================
       3. MODULE REGISTRY
       ============================================================ */
    const Modules = {
        cursor: null,
        particles: null,
        navbar: null,
        typing: null,
        scrollReveal: null,
        counters: null,
        tilt: null,
        filters: null,
        testimonials: null,
        contact: null,
        theme: null
    };

    window.Modules = Modules;

    /* ============================================================
       4. INITIALIZE ALL MODULES
       ============================================================ */
    function initModules() {
        const modulesToInit = [
            { name: 'theme',        fn: () => window.initTheme?.() },
            { name: 'cursor',       fn: () => window.initCursor?.() },
            { name: 'particles',    fn: () => window.initParticles?.() },
            { name: 'navbar',       fn: () => window.initNavbar?.() },
            { name: 'typing',       fn: () => window.initTyping?.() },
            { name: 'scrollReveal', fn: () => window.initScrollReveal?.() },
            { name: 'counters',     fn: () => window.initCounters?.() },
            { name: 'tilt',         fn: () => window.initTilt?.() },
            { name: 'filters',      fn: () => window.initFilters?.() },
            { name: 'testimonials', fn: () => window.initTestimonials?.() },
            { name: 'contact',      fn: () => window.initContact?.() }
        ];

        modulesToInit.forEach(({ name, fn }) => {
            try {
                const result = fn();
                if (result !== undefined) {
                    Modules[name] = result;
                }
            } catch (error) {
                console.warn(`[Module Error] ${name}:`, error);
            }
        });
    }

    /* ============================================================
       5. GLOBAL EVENT LISTENERS
       ============================================================ */
    function initGlobalListeners() {

        // --- Track mouse position (for cursor + particles) ---
        if (!Utils.isTouch()) {
            Utils.on(document, 'mousemove', Utils.throttle((e) => {
                AppState.mouseX = e.clientX;
                AppState.mouseY = e.clientY;
            }, 16));
        }

        // --- Track scroll position ---
        Utils.on(window, 'scroll', Utils.throttle(() => {
            AppState.scrollY = window.pageYOffset;
            document.documentElement.style.setProperty(
                '--scroll-y',
                `${AppState.scrollY}px`
            );
        }, 16));

        // --- Handle resize ---
        Utils.on(window, 'resize', Utils.debounce(() => {
            AppState.isMobile = window.innerWidth <= 1024;
        }, 200));

        // --- Close mobile menu on resize (if going to desktop) ---
        Utils.on(window, 'resize', Utils.debounce(() => {
            if (window.innerWidth > 1024) {
                const navMenu = document.getElementById('navMenu');
                const hamburger = document.getElementById('hamburger');
                const navOverlay = document.getElementById('navOverlay');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger?.classList.remove('active');
                    navOverlay?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }, 200));

        // --- Prevent scroll when mobile menu is open ---
        // (handled in navbar.js)

        // --- Handle visibility change (pause animations when tab hidden) ---
        Utils.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });

        // --- Add 'loaded' class to body when everything is ready ---
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            AppState.isLoaded = true;
        });

        // --- Keyboard accessibility: Escape closes mobile menu ---
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const hamburger = document.getElementById('hamburger');
                const navOverlay = document.getElementById('navOverlay');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger?.classList.remove('active');
                    navOverlay?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    /* ============================================================
       6. DYNAMIC YEAR IN FOOTER
       ============================================================ */
    function setCurrentYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    /* ============================================================
       7. BROWSER SUPPORT CHECK
       ============================================================ */
    function checkBrowserSupport() {
        const features = {
            intersectionObserver: 'IntersectionObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            classList: 'classList' in document.createElement('div'),
            canvas: !!document.createElement('canvas').getContext,
            customProperties: CSS.supports('--test', '0')
        };

        const missing = Object.entries(features)
            .filter(([, supported]) => !supported)
            .map(([name]) => name);

        if (missing.length > 0) {
            console.warn('[Browser Support] Missing features:', missing);
        }

        return features;
    }

    /* ============================================================
       8. ERROR HANDLER
       ============================================================ */
    function initErrorHandler() {
        window.addEventListener('error', (e) => {
            console.warn('[Global Error]', e.message);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.warn('[Unhandled Promise]', e.reason);
        });
    }

    /* ============================================================
       9. PERFORMANCE MONITOR (Optional)
       ============================================================ */
    function logPerformance() {
        if (!window.performance || !performance.timing) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

                if (loadTime > 0) {
                    console.log(
                        `%c⚡ Portfolio Loaded`,
                        'color: #61dafb; font-weight: bold; font-size: 14px;'
                    );
                    console.log(`   DOM Ready: ${domReady}ms`);
                    console.log(`   Full Load: ${loadTime}ms`);
                }
            }, 0);
        });
    }

    /* ============================================================
       10. BOOTSTRAP — MAIN ENTRY
       ============================================================ */
    function bootstrap() {
        // 1. Check browser support
        checkBrowserSupport();

        // 2. Init error handler
        initErrorHandler();

        // 3. Set current year
        setCurrentYear();

        // 4. Init global listeners
        initGlobalListeners();

        // 5. Init all modules
        initModules();

        // 6. Log performance
        logPerformance();

        // 7. Dispatch custom event (other scripts can listen)
        document.dispatchEvent(new CustomEvent('portfolio:ready'));

        console.log(
            '%c🚀 Portfolio Initialized',
            'color: #a855f7; font-weight: bold; font-size: 14px;'
        );
    }

    /* ============================================================
       11. RUN
       ============================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();