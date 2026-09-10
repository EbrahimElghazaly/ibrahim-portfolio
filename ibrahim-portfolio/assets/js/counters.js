/* ============================================================
   COUNTERS.JS — Animated Counters + Skill Bars
   Numbers count up + Skill progress bars fill
   when they enter the viewport
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, clamp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Counter animation duration (ms)
        counterDuration: 2000,
        // Skill bar animation duration (ms)
        skillDuration: 1600,
        // IntersectionObserver threshold
        threshold: 0.3,
        // Root margin
        rootMargin: '0px 0px -50px 0px',
        // Easing function for counters
        easing: 'easeOutExpo',
        // Whether to run only once
        once: true
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        counterObserver: null,
        skillObserver: null,
        animatedCounters: new Set(),
        animatedSkills: new Set()
    };

    /* ============================================================
       3. EASING FUNCTIONS
       ============================================================ */
    const Easing = {
        linear: (t) => t,

        easeOutQuad: (t) => t * (2 - t),

        easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),

        easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),

        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

        easeInOutQuad: (t) =>
            t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };

    /* ============================================================
       4. ANIMATE COUNTER
       Counts from 0 to target with easing
       ============================================================ */
    function animateCounter(el) {
        if (state.animatedCounters.has(el)) return;

        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;

        const duration = parseInt(el.dataset.duration, 10) || CONFIG.counterDuration;
        const easingFn = Easing[el.dataset.easing] || Easing[CONFIG.easing];

        // Support decimal numbers
        const decimals = target.toString().includes('.') ? 1 : 0;

        const startTime = performance.now();
        const startValue = 0;

        function update(now) {
            const elapsed = now - startTime;
            const progress = clamp(elapsed / duration, 0, 1);
            const easedProgress = easingFn(progress);
            const currentValue = startValue + (target - startValue) * easedProgress;

            el.textContent = decimals > 0
                ? currentValue.toFixed(decimals)
                : Math.floor(currentValue).toString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toString();
                el.classList.add('counter-done');
                state.animatedCounters.add(el);

                el.dispatchEvent(new CustomEvent('counter:done', {
                    bubbles: true,
                    detail: { value: target }
                }));
            }
        }

        requestAnimationFrame(update);
    }

    /* ============================================================
       5. ANIMATE SKILL BAR
       Fills the bar from 0% to target %
       ============================================================ */
    function animateSkillBar(bar) {
        if (state.animatedSkills.has(bar)) return;

        const target = parseInt(bar.dataset.progress, 10);
        if (isNaN(target)) return;

        const duration = parseInt(bar.dataset.duration, 10) || CONFIG.skillDuration;

        // Set CSS transition duration
        bar.style.transition = `width ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

        // Trigger the animation (small delay for smoothness)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bar.style.width = `${clamp(target, 0, 100)}%`;
            });
        });

        // Also animate the percent text
        const skillItem = bar.closest('.skill-item');
        if (skillItem) {
            const percentEl = skillItem.querySelector('.skill-percent');
            if (percentEl) {
                animatePercentText(percentEl, target, duration);
            }
        }

        state.animatedSkills.add(bar);
    }

    /* ============================================================
       6. ANIMATE PERCENT TEXT
       Counts the percent number next to the skill bar
       ============================================================ */
    function animatePercentText(el, target, duration) {
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = clamp(elapsed / duration, 0, 1);
            const easedProgress = Easing.easeOutExpo(progress);
            const currentValue = Math.floor(target * easedProgress);

            el.textContent = `${currentValue}%`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = `${target}%`;
            }
        }

        requestAnimationFrame(update);
    }

    /* ============================================================
       7. COUNTER OBSERVER CALLBACK
       ============================================================ */
    function handleCounterIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    /* ============================================================
       8. SKILL BAR OBSERVER CALLBACK
       ============================================================ */
    function handleSkillIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    /* ============================================================
       9. OBSERVE ELEMENTS
       ============================================================ */
    function observeCounters() {
        const counters = $$('.counter-number[data-count]');
        if (!counters.length || !state.counterObserver) return;

        counters.forEach((counter) => {
            if (state.animatedCounters.has(counter)) return;
            state.counterObserver.observe(counter);
        });
    }

    function observeSkillBars() {
        const bars = $$('.skill-progress[data-progress]');
        if (!bars.length || !state.skillObserver) return;

        bars.forEach((bar) => {
            if (state.animatedSkills.has(bar)) return;
            state.skillObserver.observe(bar);
        });
    }

    /* ============================================================
       10. FALLBACK (No IntersectionObserver)
       Just animate everything immediately
       ============================================================ */
    function applyFallback() {
        $$('.counter-number[data-count]').forEach(animateCounter);
        $$('.skill-progress[data-progress]').forEach(animateSkillBar);
    }

    /* ============================================================
       11. RESCAN (for dynamic content)
       ============================================================ */
    function rescan() {
        observeCounters();
        observeSkillBars();
    }

    /* ============================================================
       12. INIT
       ============================================================ */
    function initCounters() {
        // Check support
        if (!('IntersectionObserver' in window)) {
            console.warn('[Counters] IntersectionObserver not supported');
            applyFallback();
            return null;
        }

        // Skip if reduced motion
        if (window.Utils.prefersReducedMotion()) {
            applyFallback();
            return null;
        }

        // --- Create Counter Observer ---
        state.counterObserver = new IntersectionObserver(handleCounterIntersection, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        // --- Create Skill Bar Observer ---
        state.skillObserver = new IntersectionObserver(handleSkillIntersection, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        // --- Observe ---
        observeCounters();
        observeSkillBars();

        // --- Listen for dynamic changes ---
        document.addEventListener('content:changed', rescan);

        // --- Return API ---
        return {
            rescan,
            animateCounter,
            animateSkillBar,
            reset: () => {
                state.animatedCounters.clear();
                state.animatedSkills.clear();
                rescan();
            }
        };
    }

    /* ============================================================
       13. EXPOSE GLOBALLY
       ============================================================ */
    window.initCounters = initCounters;

})();