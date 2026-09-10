/* ============================================================
   TESTIMONIALS.JS — Testimonials Slider
   Auto-play + Dots + Arrows + Swipe + Keyboard + Pause on hover
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, clamp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Auto-play interval (ms)
        autoplayDelay: 5000,
        // Transition duration (ms) — should match CSS
        transitionDuration: 600,
        // Enable autoplay
        autoplay: true,
        // Pause on hover
        pauseOnHover: true,
        // Pause when tab is hidden
        pauseOnHidden: true,
        // Enable infinite loop
        loop: true,
        // Swipe threshold (px)
        swipeThreshold: 50,
        // Enable keyboard navigation
        keyboard: true,
        // Enable touch swipe
        touch: true,
        // Enable dots
        dots: true
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        slider: null,
        track: null,
        cards: [],
        dots: [],
        prevBtn: null,
        nextBtn: null,
        currentIndex: 0,
        totalSlides: 0,
        autoplayTimer: null,
        isPaused: false,
        isAnimating: false,
        // Touch
        touchStartX: 0,
        touchStartY: 0,
        touchEndX: 0,
        touchEndY: 0,
        isSwiping: false,
        isHorizontalSwipe: false
    };

    /* ============================================================
       3. GO TO SLIDE
       ============================================================ */
    function goToSlide(index, animate = true) {
        if (state.totalSlides === 0) return;

        // Handle loop
        if (CONFIG.loop) {
            if (index < 0) index = state.totalSlides - 1;
            if (index >= state.totalSlides) index = 0;
        } else {
            index = clamp(index, 0, state.totalSlides - 1);
        }

        // Skip if same slide
        if (index === state.currentIndex && animate) return;

        state.currentIndex = index;

        // Update track transform
        const offset = -index * 100;
        state.track.style.transform = `translate3d(${offset}%, 0, 0)`;

        // Update dots
        updateDots();

        // Update cards (active class)
        updateActiveCard();

        // Update arrows (if not looping)
        if (!CONFIG.loop) {
            updateArrows();
        }

        // Dispatch event
        document.dispatchEvent(new CustomEvent('testimonial:changed', {
            detail: {
                index: state.currentIndex,
                total: state.totalSlides
            }
        }));
    }

    /* ============================================================
       4. NEXT / PREV
       ============================================================ */
    function next() {
        goToSlide(state.currentIndex + 1);
    }

    function prev() {
        goToSlide(state.currentIndex - 1);
    }

    /* ============================================================
       5. UPDATE DOTS
       ============================================================ */
    function updateDots() {
        state.dots.forEach((dot, i) => {
            if (i === state.currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    /* ============================================================
       6. UPDATE ACTIVE CARD
       ============================================================ */
    function updateActiveCard() {
        state.cards.forEach((card, i) => {
            if (i === state.currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    /* ============================================================
       7. UPDATE ARROWS (disable at ends if not looping)
       ============================================================ */
    function updateArrows() {
        if (state.prevBtn) {
            state.prevBtn.disabled = state.currentIndex === 0;
        }
        if (state.nextBtn) {
            state.nextBtn.disabled = state.currentIndex === state.totalSlides - 1;
        }
    }

    /* ============================================================
       8. CREATE DOTS
       ============================================================ */
    function createDots() {
        const dotsContainer = document.getElementById('testimonialDots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        for (let i = 0; i < state.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.dataset.index = i;

            if (i === 0) dot.classList.add('active');

            on(dot, 'click', () => {
                goToSlide(i);
                restartAutoplay();
            });

            dotsContainer.appendChild(dot);
            state.dots.push(dot);
        }
    }

    /* ============================================================
       9. AUTOPLAY
       ============================================================ */
    function startAutoplay() {
        if (!CONFIG.autoplay) return;
        if (state.autoplayTimer) return;

        state.autoplayTimer = setInterval(() => {
            if (!state.isPaused && !document.hidden) {
                next();
            }
        }, CONFIG.autoplayDelay);
    }

    function stopAutoplay() {
        if (state.autoplayTimer) {
            clearInterval(state.autoplayTimer);
            state.autoplayTimer = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    function pauseAutoplay() {
        state.isPaused = true;
    }

    function resumeAutoplay() {
        state.isPaused = false;
    }

    /* ============================================================
       10. TOUCH / SWIPE HANDLERS
       ============================================================ */
    function handleTouchStart(e) {
        if (!CONFIG.touch) return;

        const touch = e.touches[0];
        state.touchStartX = touch.clientX;
        state.touchStartY = touch.clientY;
        state.touchEndX = touch.clientX;
        state.touchEndY = touch.clientY;
        state.isSwiping = true;
        state.isHorizontalSwipe = false;
    }

    function handleTouchMove(e) {
        if (!state.isSwiping) return;

        const touch = e.touches[0];
        state.touchEndX = touch.clientX;
        state.touchEndY = touch.clientY;

        const deltaX = Math.abs(state.touchEndX - state.touchStartX);
        const deltaY = Math.abs(state.touchEndY - state.touchStartY);

        // Detect horizontal swipe
        if (deltaX > deltaY && deltaX > 10) {
            state.isHorizontalSwipe = true;
        }
    }

    function handleTouchEnd() {
        if (!state.isSwiping) return;

        const deltaX = state.touchEndX - state.touchStartX;
        const deltaY = state.touchEndY - state.touchStartY;

        // Only handle horizontal swipes
        if (state.isHorizontalSwipe) {
            if (Math.abs(deltaX) > CONFIG.swipeThreshold) {
                if (deltaX < 0) {
                    // Swipe left → next
                    next();
                } else {
                    // Swipe right → prev
                    prev();
                }
                restartAutoplay();
            }
        }

        // Reset
        state.isSwiping = false;
        state.isHorizontalSwipe = false;
        state.touchStartX = 0;
        state.touchStartY = 0;
        state.touchEndX = 0;
        state.touchEndY = 0;
    }

    /* ============================================================
       11. KEYBOARD HANDLER
       ============================================================ */
    function handleKeydown(e) {
        if (!CONFIG.keyboard) return;

        // Ignore if typing in input
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case 'ArrowLeft':
                prev();
                restartAutoplay();
                break;
            case 'ArrowRight':
                next();
                restartAutoplay();
                break;
            default:
                break;
        }
    }

    /* ============================================================
       12. HOVER HANDLERS
       ============================================================ */
    function handleMouseEnter() {
        if (CONFIG.pauseOnHover) {
            pauseAutoplay();
        }
    }

    function handleMouseLeave() {
        if (CONFIG.pauseOnHover) {
            resumeAutoplay();
        }
    }

    /* ============================================================
       13. VISIBILITY HANDLER
       ============================================================ */
    function handleVisibilityChange() {
        if (!CONFIG.pauseOnHidden) return;

        if (document.hidden) {
            pauseAutoplay();
        } else {
            resumeAutoplay();
        }
    }

    /* ============================================================
       14. HANDLE RESIZE
       ============================================================ */
    const handleResize = window.Utils.debounce(() => {
        // Recalculate slide width (uses percentage, so just re-apply)
        const offset = -state.currentIndex * 100;
        state.track.style.transform = `translate3d(${offset}%, 0, 0)`;
    }, 200);

    /* ============================================================
       15. REFRESH (for dynamic content)
       ============================================================ */
    function refresh() {
        state.cards = $$('.testimonial-card', state.track);
        state.totalSlides = state.cards.length;

        // Reset dots
        state.dots = [];
        createDots();

        // Reset index if out of bounds
        if (state.currentIndex >= state.totalSlides) {
            state.currentIndex = 0;
        }

        goToSlide(state.currentIndex, false);
    }

    /* ============================================================
       16. INIT
       ============================================================ */
    function initTestimonials() {
        // Find elements
        state.slider = $('.testimonials-slider');
        state.track = document.getElementById('testimonialTrack');
        state.prevBtn = document.getElementById('prevTestimonial');
        state.nextBtn = document.getElementById('nextTestimonial');

        // Safety check
        if (!state.slider || !state.track) {
            console.warn('[Testimonials] Slider or track not found');
            return null;
        }

        // Get cards
        state.cards = $$('.testimonial-card', state.track);
        state.totalSlides = state.cards.length;

        if (state.totalSlides === 0) {
            console.warn('[Testimonials] No testimonial cards found');
            return null;
        }

        // Skip if only one slide
        if (state.totalSlides === 1) {
            if (state.prevBtn) state.prevBtn.style.display = 'none';
            if (state.nextBtn) state.nextBtn.style.display = 'none';
            return null;
        }

        // --- Create dots ---
        if (CONFIG.dots) {
            createDots();
        }

        // --- Set initial active card ---
        updateActiveCard();

        // --- Attach arrow listeners ---
        if (state.prevBtn) {
            on(state.prevBtn, 'click', () => {
                prev();
                restartAutoplay();
            });
        }

        if (state.nextBtn) {
            on(state.nextBtn, 'click', () => {
                next();
                restartAutoplay();
            });
        }

        // --- Hover pause ---
        if (CONFIG.pauseOnHover) {
            on(state.slider, 'mouseenter', handleMouseEnter);
            on(state.slider, 'mouseleave', handleMouseLeave);
        }

        // --- Touch events ---
        if (CONFIG.touch) {
            on(state.track, 'touchstart', handleTouchStart, { passive: true });
            on(state.track, 'touchmove', handleTouchMove, { passive: true });
            on(state.track, 'touchend', handleTouchEnd);
            on(state.track, 'touchcancel', handleTouchEnd);
        }

        // --- Keyboard ---
        if (CONFIG.keyboard) {
            on(document, 'keydown', handleKeydown);
        }

        // --- Visibility ---
        if (CONFIG.pauseOnHidden) {
            on(document, 'visibilitychange', handleVisibilityChange);
        }

        // --- Resize ---
        on(window, 'resize', handleResize);

        // --- Dynamic content ---
        document.addEventListener('content:changed', refresh);

        // --- Start autoplay ---
        if (CONFIG.autoplay) {
            startAutoplay();
        }

        // --- Return API ---
        return {
            next,
            prev,
            goTo: goToSlide,
            pause: pauseAutoplay,
            resume: resumeAutoplay,
            refresh,
            getCurrent: () => state.currentIndex,
            getTotal: () => state.totalSlides,
            start: startAutoplay,
            stop: stopAutoplay,
            restart: restartAutoplay
        };
    }

    /* ============================================================
       17. EXPOSE GLOBALLY
       ============================================================ */
    window.initTestimonials = initTestimonials;

})();