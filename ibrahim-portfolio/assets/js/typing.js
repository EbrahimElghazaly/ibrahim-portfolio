/* ============================================================
   TYPING.JS — Typing Animation
   Typewriter effect for Hero section (type + delete + loop)
   ============================================================ */

(function () {
    'use strict';

    const { $, on } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Words to cycle through
        words: [
            'Front-End Developer',
            'React Developer',
            'UI Engineer',
            'Web Designer'
        ],
        // Typing speed (ms per character)
        typeSpeed: 80,
        // Deleting speed (ms per character)
        deleteSpeed: 40,
        // Pause after typing a full word (ms)
        pauseAfterType: 1800,
        // Pause after deleting a full word (ms)
        pauseAfterDelete: 400,
        // Start delay (ms)
        startDelay: 500,
        // Whether to loop forever
        loop: true
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        element: null,
        currentWordIndex: 0,
        currentCharIndex: 0,
        isDeleting: false,
        isPaused: false,
        timeoutId: null,
        isRunning: false,
        prefersReducedMotion: false
    };

    /* ============================================================
       3. TYPE CHARACTER
       ============================================================ */
    function type() {
        if (!state.isRunning) return;

        const currentWord = CONFIG.words[state.currentWordIndex];

        if (state.isDeleting) {
            // --- Deleting ---
            state.currentCharIndex--;
            state.element.textContent = currentWord.substring(0, state.currentCharIndex);

            if (state.currentCharIndex === 0) {
                // Finished deleting → move to next word
                state.isDeleting = false;
                state.currentWordIndex = (state.currentWordIndex + 1) % CONFIG.words.length;
                state.timeoutId = setTimeout(type, CONFIG.pauseAfterDelete);
            } else {
                state.timeoutId = setTimeout(type, CONFIG.deleteSpeed);
            }
        } else {
            // --- Typing ---
            state.currentCharIndex++;
            state.element.textContent = currentWord.substring(0, state.currentCharIndex);

            if (state.currentCharIndex === currentWord.length) {
                // Finished typing → pause, then delete
                if (!CONFIG.loop && state.currentWordIndex === CONFIG.words.length - 1) {
                    // Stop if loop is disabled and last word
                    state.isRunning = false;
                    return;
                }

                state.isDeleting = true;
                state.timeoutId = setTimeout(type, CONFIG.pauseAfterType);
            } else {
                state.timeoutId = setTimeout(type, CONFIG.typeSpeed);
            }
        }
    }

    /* ============================================================
       4. START / STOP / PAUSE
       ============================================================ */
    function start() {
        if (state.isRunning) return;
        state.isRunning = true;
        type();
    }

    function stop() {
        state.isRunning = false;
        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
            state.timeoutId = null;
        }
    }

    function pause() {
        state.isPaused = true;
        stop();
    }

    function resume() {
        if (!state.isPaused) return;
        state.isPaused = false;
        start();
    }

    /* ============================================================
       5. RESET
       ============================================================ */
    function reset() {
        stop();
        state.currentWordIndex = 0;
        state.currentCharIndex = 0;
        state.isDeleting = false;
        if (state.element) {
            state.element.textContent = '';
        }
    }

    /* ============================================================
       6. FALLBACK (Reduced Motion)
       Just show the first word statically
       ============================================================ */
    function applyFallback() {
        if (!state.element) return;
        state.element.textContent = CONFIG.words[0];
    }

    /* ============================================================
       7. HANDLE VISIBILITY CHANGE
       Pause when tab is hidden (save CPU)
       ============================================================ */
    function handleVisibilityChange() {
        if (document.hidden) {
            pause();
        } else {
            resume();
        }
    }

    /* ============================================================
       8. INIT
       ============================================================ */
    function initTyping() {
        // Find element
        state.element = document.getElementById('typingText');
        if (!state.element) {
            console.warn('[Typing] Element #typingText not found');
            return null;
        }

        // Check reduced motion
        state.prefersReducedMotion = window.Utils.prefersReducedMotion();

        if (state.prefersReducedMotion) {
            applyFallback();
            return {
                start: () => {},
                stop: () => {},
                reset: () => {}
            };
        }

        // Start after delay
        state.timeoutId = setTimeout(start, CONFIG.startDelay);

        // Handle tab visibility
        on(document, 'visibilitychange', handleVisibilityChange);

        // Return API
        return {
            start,
            stop,
            pause,
            resume,
            reset,
            setWords: (words) => {
                if (Array.isArray(words) && words.length > 0) {
                    CONFIG.words = words;
                    reset();
                    start();
                }
            }
        };
    }

    /* ============================================================
       9. EXPOSE GLOBALLY
       ============================================================ */
    window.initTyping = initTyping;

})();