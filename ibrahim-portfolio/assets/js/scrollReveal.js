/* ============================================================
   SCROLLREVEAL.JS — Reveal Elements on Scroll
   IntersectionObserver + Stagger + Split Text
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Reveal threshold
        threshold: 0.15,
        // Root margin (trigger before entering viewport)
        rootMargin: '0px 0px -80px 0px',
        // Delay between staggered children (ms)
        staggerDelay: 80,
        // Add reveal animation to elements with [data-reveal]
        revealAttribute: 'data-reveal',
        // Class added when element is revealed
        revealedClass: 'revealed',
        // Whether to add stagger to children automatically
        autoStagger: true,
        // Elements to split into chars/words
        splitSelectors: [
            '[data-split="chars"]',
            '[data-split="words"]'
        ]
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        observer: null,
        observedElements: new Set(),
        isSupported: false
    };

    /* ============================================================
       3. CHECK SUPPORT
       ============================================================ */
    function checkSupport() {
        state.isSupported = 'IntersectionObserver' in window;
        return state.isSupported;
    }

    /* ============================================================
       4. SPLIT TEXT
       Wraps each char/word in a span for staggered animation
       ============================================================ */
    function splitText(el, mode = 'chars') {
        // Skip if already split
        if (el.dataset.splitDone === 'true') return;

        const text = el.textContent.trim();
        el.textContent = '';
        el.dataset.splitDone = 'true';

        if (mode === 'words') {
            // Split into words
            const words = text.split(/\s+/);
            words.forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                span.style.animationDelay = `${i * 0.08}s`;
                el.appendChild(span);

                // Add space between words
                if (i < words.length - 1) {
                    el.appendChild(document.createTextNode(' '));
                }
            });
        } else {
            // Split into chars
            const chars = text.split('');
            chars.forEach((char, i) => {
                if (char === ' ') {
                    el.appendChild(document.createTextNode(' '));
                    return;
                }
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                span.style.animationDelay = `${i * 0.03}s`;
                el.appendChild(span);
            });
        }

        // Add split-text class for base styles
        el.classList.add(mode === 'words' ? 'split-words' : 'split-text');
    }

    /* ============================================================
       5. INIT SPLIT TEXT
       Split all elements with [data-split]
       ============================================================ */
    function initSplitText() {
        CONFIG.splitSelectors.forEach((selector) => {
            const mode = selector.includes('words') ? 'words' : 'chars';
            $$(selector).forEach((el) => {
                splitText(el, mode);
            });
        });
    }

    /* ============================================================
       6. AUTO STAGGER
       Adds transition-delay to children of [data-stagger]
       ============================================================ */
    function initAutoStagger() {
        $$('[data-stagger]').forEach((parent) => {
            const children = [...parent.children];
            children.forEach((child, i) => {
                child.style.transitionDelay = `${i * (CONFIG.staggerDelay / 1000)}s`;
                // Also add reveal attribute if not present
                if (!child.hasAttribute(CONFIG.revealAttribute)) {
                    child.setAttribute(CONFIG.revealAttribute, '');
                }
            });
        });
    }

    /* ============================================================
       7. REVEAL ELEMENT
       ============================================================ */
    function revealElement(el) {
        if (el.classList.contains(CONFIG.revealedClass)) return;

        el.classList.add(CONFIG.revealedClass);
        el.dispatchEvent(new CustomEvent('reveal:shown', {
            bubbles: true,
            detail: { element: el }
        }));
    }

    /* ============================================================
       8. OBSERVER CALLBACK
       ============================================================ */
    function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                revealElement(entry.target);
                observer.unobserve(entry.target);
                state.observedElements.delete(entry.target);
            }
        });
    }

    /* ============================================================
       9. OBSERVE ELEMENTS
       ============================================================ */
    function observeElements(elements) {
        if (!state.observer) return;

        elements.forEach((el) => {
            if (state.observedElements.has(el)) return;
            if (el.classList.contains(CONFIG.revealedClass)) return;

            state.observer.observe(el);
            state.observedElements.add(el);
        });
    }

    /* ============================================================
       10. FALLBACK (No IntersectionObserver)
       Just reveal everything
       ============================================================ */
    function applyFallback() {
        $$(`[${CONFIG.revealAttribute}]`).forEach((el) => {
            el.classList.add(CONFIG.revealedClass);
        });
    }

    /* ============================================================
       11. HANDLE DYNAMIC CONTENT
       Re-scan when projects are filtered, etc.
       ============================================================ */
    function rescan() {
        const elements = $$(`[${CONFIG.revealAttribute}]:not(.${CONFIG.revealedClass})`);
        observeElements(elements);
    }

    /* ============================================================
       12. INIT
       ============================================================ */
    function initScrollReveal() {
        // Check support
        if (!checkSupport()) {
            console.warn('[ScrollReveal] IntersectionObserver not supported');
            applyFallback();
            return null;
        }

        // Skip if reduced motion
        if (window.Utils.prefersReducedMotion()) {
            applyFallback();
            return null;
        }

        // Split text first (before observing)
        initSplitText();

        // Auto stagger
        if (CONFIG.autoStagger) {
            initAutoStagger();
        }

        // Create observer
        state.observer = new IntersectionObserver(handleIntersection, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        // Observe all [data-reveal] elements
        rescan();

        // Listen for dynamic events
        document.addEventListener('projects:filtered', rescan);
        document.addEventListener('content:changed', rescan);

        // Return API
        return {
            rescan,
            reveal: revealElement,
            observe: observeElements,
            observer: state.observer
        };
    }

    /* ============================================================
       13. EXPOSE GLOBALLY
       ============================================================ */
    window.initScrollReveal = initScrollReveal;

})();