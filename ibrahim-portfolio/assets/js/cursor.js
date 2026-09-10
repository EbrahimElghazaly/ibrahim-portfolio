/* ============================================================
   CURSOR.JS — Custom Cursor
   Smooth follow with Lerp + Hover states + Click animation
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, lerp, clamp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Lerp amount for dot (higher = faster)
        dotSpeed: 0.9,
        // Lerp amount for outline (lower = smoother/slower)
        outlineSpeed: 0.15,
        // Elements that trigger "hover" state
        hoverSelectors: [
            'a',
            'button',
            'input',
            'textarea',
            'select',
            '[role="button"]',
            '.btn',
            '.nav-link',
            '.filter-btn',
            '.project-card',
            '.service-card',
            '.testimonial-btn',
            '.theme-toggle',
            '.hamburger',
            '.contact-item',
            '.hero-socials a',
            '.footer-socials a',
            '.back-to-top',
            '.indicator-dot',
            '.timeline-content',
            '.achievement-card'
        ],
        // Elements that trigger "view" state (bigger circle with label)
        viewSelectors: [
            '.project-card'
        ]
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    let dot = null;
    let outline = null;

    // Mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Cursor positions (for lerp)
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Animation frame ID
    let rafId = null;

    // Flags
    let isEnabled = false;
    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;

    /* ============================================================
       3. CHECK IF CURSOR SHOULD BE ENABLED
       Disable on touch devices + reduced motion
       ============================================================ */
    function shouldEnable() {
        // Don't enable on touch devices
        if (window.Utils.isTouch()) return false;

        // Don't enable on small screens
        if (window.innerWidth <= 1024) return false;

        // Don't enable if user prefers reduced motion
        if (window.Utils.prefersReducedMotion()) return false;

        return true;
    }

    /* ============================================================
       4. UPDATE CURSOR POSITION (Animation Loop)
       Uses lerp for smooth following
       ============================================================ */
    function updateCursor() {
        if (!isEnabled) return;

        // Lerp positions
        dotX = lerp(dotX, mouseX, CONFIG.dotSpeed);
        dotY = lerp(dotY, mouseY, CONFIG.dotSpeed);
        outlineX = lerp(outlineX, mouseX, CONFIG.outlineSpeed);
        outlineY = lerp(outlineY, mouseY, CONFIG.outlineSpeed);

        // Apply transforms
        if (dot) {
            dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        }
        if (outline) {
            outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%) scale(${isMouseDown ? 0.8 : 1})`;
        }

        rafId = requestAnimationFrame(updateCursor);
    }

    /* ============================================================
       5. START / STOP ANIMATION
       ============================================================ */
    function startAnimation() {
        if (rafId) return;
        rafId = requestAnimationFrame(updateCursor);
    }

    function stopAnimation() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    /* ============================================================
       6. MOUSE MOVE HANDLER
       ============================================================ */
    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            showCursor();
        }
    }

    /* ============================================================
       7. SHOW / HIDE CURSOR
       ============================================================ */
    function showCursor() {
        if (isVisible) return;
        isVisible = true;
        if (dot) dot.style.opacity = '1';
        if (outline) outline.style.opacity = '1';
    }

    function hideCursor() {
        if (!isVisible) return;
        isVisible = false;
        if (dot) dot.style.opacity = '0';
        if (outline) outline.style.opacity = '0';
    }

    /* ============================================================
       8. HOVER HANDLERS
       ============================================================ */
    function addHoverListeners() {
        const hoverElements = $$(CONFIG.hoverSelectors.join(','));
        const viewElements = $$(CONFIG.viewSelectors.join(','));

        // Hover state (small scale)
        hoverElements.forEach((el) => {
            on(el, 'mouseenter', () => {
                isHovering = true;
                if (outline) outline.classList.add('hover');
            });
            on(el, 'mouseleave', () => {
                isHovering = false;
                if (outline) outline.classList.remove('hover');
            });
        });

        // View state (bigger circle + label)
        viewElements.forEach((el) => {
            on(el, 'mouseenter', () => {
                if (outline) outline.classList.add('view');
            });
            on(el, 'mouseleave', () => {
                if (outline) outline.classList.remove('view');
            });
        });
    }

    /* ============================================================
       9. MOUSE DOWN / UP (Click animation)
       ============================================================ */
    function onMouseDown() {
        isMouseDown = true;
        if (outline) outline.classList.add('click');
    }

    function onMouseUp() {
        isMouseDown = false;
        if (outline) outline.classList.remove('click');
    }

    /* ============================================================
       10. HANDLE WINDOW LEAVE / ENTER
       Hide cursor when mouse leaves window
       ============================================================ */
    function onWindowLeave() {
        hideCursor();
    }

    function onWindowEnter() {
        showCursor();
    }

    /* ============================================================
       11. HANDLE RESIZE
       Re-evaluate if cursor should be enabled
       ============================================================ */
    function handleResize() {
        const shouldBeEnabled = shouldEnable();

        if (shouldBeEnabled && !isEnabled) {
            enable();
        } else if (!shouldBeEnabled && isEnabled) {
            disable();
        }
    }

    /* ============================================================
       12. ENABLE / DISABLE
       ============================================================ */
    function enable() {
        if (isEnabled) return;
        isEnabled = true;
        document.body.classList.add('custom-cursor-enabled');
        startAnimation();
    }

    function disable() {
        if (!isEnabled) return;
        isEnabled = false;
        stopAnimation();
        document.body.classList.remove('custom-cursor-enabled');
        hideCursor();
    }

    /* ============================================================
       13. INIT
       ============================================================ */
    function initCursor() {
        // Find elements
        dot = document.getElementById('cursorDot');
        outline = document.getElementById('cursorOutline');

        if (!dot || !outline) {
            console.warn('[Cursor] Elements not found');
            return;
        }

        // Check if should be enabled
        if (!shouldEnable()) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            return;
        }

        // Initial position (off-screen)
        dotX = dotY = outlineX = outlineY = -100;

        // Attach listeners
        on(document, 'mousemove', onMouseMove, { passive: true });
        on(document, 'mousedown', onMouseDown);
        on(document, 'mouseup', onMouseUp);
        on(document, 'mouseleave', onWindowLeave);
        on(document, 'mouseenter', onWindowEnter);
        on(window, 'resize', window.Utils.debounce(handleResize, 200));

        // Add hover listeners
        addHoverListeners();

        // Re-add hover listeners when new elements appear (e.g., filtered projects)
        document.addEventListener('projects:filtered', () => {
            addHoverListeners();
        });

        // Enable
        enable();

        return {
            enable,
            disable,
            isEnabled: () => isEnabled
        };
    }

    /* ============================================================
       14. EXPOSE GLOBALLY
       ============================================================ */
    window.initCursor = initCursor;

})();