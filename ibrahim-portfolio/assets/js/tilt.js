/* ============================================================
   TILT.JS — 3D Tilt Effect
   Cards tilt based on mouse position + glare effect
   ============================================================ */

(function () {
    'use strict';

    const { $$, on, clamp, lerp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Selectors for elements that should have tilt
        selectors: [
            '.project-card',
            '.service-card',
            '.achievement-card',
            '.timeline-content',
            '.contact-item'
        ],
        // Max tilt angle (degrees)
        maxTilt: 12,
        // Max glare opacity
        maxGlare: 0.25,
        // Perspective (px) — lower = stronger effect
        perspective: 1000,
        // Scale on hover
        hoverScale: 1.02,
        // Speed of transition (ms)
        transitionSpeed: 400,
        // Disable on touch devices
        disableOnTouch: true,
        // Disable on reduced motion
        respectReducedMotion: true
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        elements: [],
        isEnabled: false,
        prefersReducedMotion: false
    };

    /* ============================================================
       3. CHECK IF SHOULD ENABLE
       ============================================================ */
    function shouldEnable() {
        // Disable on touch devices
        if (CONFIG.disableOnTouch && window.Utils.isTouch()) {
            return false;
        }

        // Disable on reduced motion
        if (CONFIG.respectReducedMotion && state.prefersReducedMotion) {
            return false;
        }

        // Disable on small screens
        if (window.innerWidth < 768) {
            return false;
        }

        return true;
    }

    /* ============================================================
       4. TILT HANDLER (Mouse Move)
       ============================================================ */
    function handleMouseMove(e, el, state) {
        const rect = el.getBoundingClientRect();

        // Mouse position relative to element (0-1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Convert to -1 to 1
        const xNorm = (x - 0.5) * 2;
        const yNorm = (y - 0.5) * 2;

        // Calculate tilt angles
        const tiltX = yNorm * -CONFIG.maxTilt;  // Negative = natural direction
        const tiltY = xNorm * CONFIG.maxTilt;

        // Apply transform
        el.style.transform = `
            perspective(${CONFIG.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(${CONFIG.hoverScale}, ${CONFIG.hoverScale}, ${CONFIG.hoverScale})
        `;

        // Update glare position
        if (state.glare) {
            state.glare.style.background = `
                radial-gradient(
                    circle at ${x * 100}% ${y * 100}%,
                    rgba(255, 255, 255, ${CONFIG.maxGlare}) 0%,
                    transparent 60%
                )
            `;
            state.glare.style.opacity = '1';
        }
    }

    /* ============================================================
       5. TILT HANDLER (Mouse Enter)
       ============================================================ */
    function handleMouseEnter(el, state) {
        el.style.transition = `transform ${CONFIG.transitionSpeed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.willChange = 'transform';

        if (state.glare) {
            state.glare.style.opacity = '1';
        }
    }

    /* ============================================================
       6. TILT HANDLER (Mouse Leave)
       ============================================================ */
    function handleMouseLeave(el, state) {
        el.style.transform = `
            perspective(${CONFIG.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;

        if (state.glare) {
            state.glare.style.opacity = '0';
        }

        // Reset transition after animation
        setTimeout(() => {
            el.style.transition = '';
            el.style.willChange = '';
        }, CONFIG.transitionSpeed);
    }

    /* ============================================================
       7. CREATE GLARE ELEMENT
       ============================================================ */
    function createGlare(el) {
        // Check if glare already exists
        if (el.querySelector('.tilt-glare')) {
            return el.querySelector('.tilt-glare');
        }

        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
        `;

        // Make sure the parent is positioned
        const position = window.getComputedStyle(el).position;
        if (position === 'static') {
            el.style.position = 'relative';
        }

        el.appendChild(glare);
        return glare;
    }

    /* ============================================================
       8. ATTACH TILT TO ELEMENT
       ============================================================ */
    function attachTilt(el) {
        // Skip if already attached
        if (el.dataset.tiltAttached === 'true') return;

        // Get glare element
        const glare = createGlare(el);

        // Local state for this element
        const elementState = {
            glare,
            ticking: false
        };

        // Add class for CSS
        el.classList.add('tilt');

        // --- Listeners ---
        on(el, 'mouseenter', () => handleMouseEnter(el, elementState));

        on(el, 'mousemove', (e) => {
            if (elementState.ticking) return;
            elementState.ticking = true;

            requestAnimationFrame(() => {
                handleMouseMove(e, el, elementState);
                elementState.ticking = false;
            });
        });

        on(el, 'mouseleave', () => handleMouseLeave(el, elementState));

        // Mark as attached
        el.dataset.tiltAttached = 'true';
    }

    /* ============================================================
       9. ATTACH TILT TO ALL ELEMENTS
       ============================================================ */
    function attachTiltToAll() {
        const elements = $$(CONFIG.selectors.join(','));

        elements.forEach((el) => {
            // Skip if disabled
            if (el.dataset.tilt === 'false') return;
            attachTilt(el);
        });

        state.elements = elements;
    }

    /* ============================================================
       10. DETACH TILT (Cleanup)
       ============================================================ */
    function detachTilt(el) {
        if (el.dataset.tiltAttached !== 'true') return;

        // Reset styles
        el.style.transform = '';
        el.style.transition = '';
        el.style.willChange = '';

        // Remove glare
        const glare = el.querySelector('.tilt-glare');
        if (glare) glare.remove();

        // Remove class
        el.classList.remove('tilt');

        // Remove flag
        delete el.dataset.tiltAttached;
    }

    function detachAll() {
        state.elements.forEach(detachTilt);
        state.elements = [];
    }

    /* ============================================================
       11. HANDLE RESIZE
       Re-evaluate if tilt should be enabled
       ============================================================ */
    const handleResize = window.Utils.debounce(() => {
        const shouldBeEnabled = shouldEnable();

        if (shouldBeEnabled && !state.isEnabled) {
            enable();
        } else if (!shouldBeEnabled && state.isEnabled) {
            disable();
        }
    }, 250);

    /* ============================================================
       12. ENABLE / DISABLE
       ============================================================ */
    function enable() {
        if (state.isEnabled) return;
        state.isEnabled = true;
        attachTiltToAll();
    }

    function disable() {
        if (!state.isEnabled) return;
        state.isEnabled = false;
        detachAll();
    }

    /* ============================================================
       13. RESCAN (for dynamic content)
       ============================================================ */
    function rescan() {
        if (!state.isEnabled) return;
        attachTiltToAll();
    }

    /* ============================================================
       14. INIT
       ============================================================ */
    function initTilt() {
        // Check reduced motion
        state.prefersReducedMotion = window.Utils.prefersReducedMotion();

        // Check if should enable
        if (!shouldEnable()) {
            return {
                enable: () => {},
                disable: () => {},
                rescan: () => {}
            };
        }

        // Enable
        enable();

        // Listen for resize
        on(window, 'resize', handleResize);

        // Listen for dynamic content
        document.addEventListener('projects:filtered', rescan);
        document.addEventListener('content:changed', rescan);

        // Return API
        return {
            enable,
            disable,
            rescan,
            attachTilt,
            detachTilt
        };
    }

    /* ============================================================
       15. EXPOSE GLOBALLY
       ============================================================ */
    window.initTilt = initTilt;

})();