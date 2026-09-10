/* ============================================================
   FILTERS.JS — Project Filters
   Filter projects by category with smooth animations
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, debounce } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Animation duration (ms)
        animationDuration: 500,
        // Whether to update URL hash
        updateURL: true,
        // Default filter
        defaultFilter: 'all',
        // Filter button selector
        filterBtnSelector: '.filter-btn',
        // Project card selector
        projectCardSelector: '.project-card',
        // Active filter button class
        activeClass: 'active',
        // Hidden project class
        hiddenClass: 'hidden',
        // Fade out class
        fadeOutClass: 'filter-fade-out',
        // Fade in class
        fadeInClass: 'filter-fade-in'
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        container: null,
        filterButtons: [],
        projectCards: [],
        currentFilter: CONFIG.defaultFilter,
        isAnimating: false
    };

    /* ============================================================
       3. APPLY FILTER
       Shows/hides projects based on category
       ============================================================ */
    function applyFilter(filter, animate = true) {
        if (state.isAnimating) return;

        // Normalize filter
        filter = filter || CONFIG.defaultFilter;

        // Skip if same filter
        if (filter === state.currentFilter && animate) return;

        state.currentFilter = filter;
        state.isAnimating = true;

        // --- Phase 1: Fade out all cards ---
        if (animate) {
            state.projectCards.forEach((card) => {
                card.classList.add(CONFIG.fadeOutClass);
            });
        }

        // --- Phase 2: After fade out, hide/show + fade in ---
        const delay = animate ? CONFIG.animationDuration / 2 : 0;

        setTimeout(() => {
            let visibleCount = 0;

            state.projectCards.forEach((card) => {
                const category = card.dataset.category || '';
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.classList.remove(CONFIG.hiddenClass);
                    visibleCount++;
                } else {
                    card.classList.add(CONFIG.hiddenClass);
                }

                card.classList.remove(CONFIG.fadeOutClass);
            });

            // --- Phase 3: Fade in ---
            if (animate) {
                state.projectCards.forEach((card, i) => {
                    if (!card.classList.contains(CONFIG.hiddenClass)) {
                        card.style.animationDelay = `${i * 0.05}s`;
                        card.classList.add(CONFIG.fadeInClass);
                    }
                });
            }

            // --- Cleanup ---
            setTimeout(() => {
                state.projectCards.forEach((card) => {
                    card.classList.remove(CONFIG.fadeInClass);
                    card.style.animationDelay = '';
                });
                state.isAnimating = false;

                // Dispatch event
                document.dispatchEvent(new CustomEvent('projects:filtered', {
                    detail: {
                        filter,
                        visibleCount,
                        totalCount: state.projectCards.length
                    }
                }));
            }, animate ? CONFIG.animationDuration : 0);
        }, delay);

        // --- Update active button ---
        updateActiveButton(filter);

        // --- Update URL hash ---
        if (CONFIG.updateURL && animate) {
            updateURLHash(filter);
        }
    }

    /* ============================================================
       4. UPDATE ACTIVE BUTTON
       ============================================================ */
    function updateActiveButton(filter) {
        state.filterButtons.forEach((btn) => {
            const btnFilter = btn.dataset.filter;
            if (btnFilter === filter) {
                btn.classList.add(CONFIG.activeClass);
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove(CONFIG.activeClass);
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /* ============================================================
       5. UPDATE URL HASH
       ============================================================ */
    function updateURLHash(filter) {
        if (!history.replaceState) return;

        const hash = filter === CONFIG.defaultFilter ? '' : `#projects-${filter}`;
        const url = window.location.pathname + window.location.search + hash;

        history.replaceState(null, '', url);
    }

    /* ============================================================
       6. READ URL HASH
       ============================================================ */
    function readURLHash() {
        const hash = window.location.hash;

        if (hash.startsWith('#projects-')) {
            const filter = hash.replace('#projects-', '');
            return filter;
        }

        return null;
    }

    /* ============================================================
       7. HANDLE FILTER BUTTON CLICK
       ============================================================ */
    function handleFilterClick(e) {
        const btn = e.currentTarget;
        const filter = btn.dataset.filter;

        if (!filter) return;

        e.preventDefault();
        applyFilter(filter, true);
    }

    /* ============================================================
       8. HANDLE KEYBOARD NAVIGATION
       Arrow keys to navigate between buttons
       ============================================================ */
    function handleFilterKeydown(e) {
        const currentIndex = state.filterButtons.indexOf(e.currentTarget);

        let nextIndex = currentIndex;
        let handled = false;

        switch (e.key) {
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % state.filterButtons.length;
                handled = true;
                break;
            case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + state.filterButtons.length) % state.filterButtons.length;
                handled = true;
                break;
            case 'Home':
                nextIndex = 0;
                handled = true;
                break;
            case 'End':
                nextIndex = state.filterButtons.length - 1;
                handled = true;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleFilterClick(e);
                handled = true;
                break;
            default:
                break;
        }

        if (handled && nextIndex !== currentIndex) {
            e.preventDefault();
            state.filterButtons[nextIndex].focus();
        }
    }

    /* ============================================================
       9. GET AVAILABLE FILTERS
       Returns array of unique categories
       ============================================================ */
    function getAvailableFilters() {
        const categories = new Set();
        categories.add(CONFIG.defaultFilter);

        state.projectCards.forEach((card) => {
            const category = card.dataset.category;
            if (category) categories.add(category);
        });

        return [...categories];
    }

    /* ============================================================
       10. COUNT PROJECTS BY FILTER
       ============================================================ */
    function countByFilter(filter) {
        if (filter === CONFIG.defaultFilter) {
            return state.projectCards.length;
        }

        return state.projectCards.filter(
            (card) => card.dataset.category === filter
        ).length;
    }

    /* ============================================================
       11. REFRESH CARDS (for dynamic content)
       ============================================================ */
    function refreshCards() {
        state.projectCards = $$(CONFIG.projectCardSelector);

        // Re-apply current filter (without animation)
        applyFilter(state.currentFilter, false);
    }

    /* ============================================================
       12. HANDLE HASH CHANGE (browser back/forward)
       ============================================================ */
    function handleHashChange() {
        const filter = readURLHash();
        if (filter && filter !== state.currentFilter) {
            applyFilter(filter, true);
        }
    }

    /* ============================================================
       13. INIT
       ============================================================ */
    function initFilters() {
        // Find elements
        state.container = $('.projects-grid');
        state.filterButtons = $$(CONFIG.filterBtnSelector);
        state.projectCards = $$(CONFIG.projectCardSelector);

        // Safety check
        if (!state.filterButtons.length || !state.projectCards.length) {
            console.warn('[Filters] No filter buttons or project cards found');
            return null;
        }

        // --- Attach listeners to filter buttons ---
        state.filterButtons.forEach((btn) => {
            on(btn, 'click', handleFilterClick);
            on(btn, 'keydown', handleFilterKeydown);

            // Add ARIA
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-pressed', btn.classList.contains(CONFIG.activeClass) ? 'true' : 'false');
        });

        // --- Read initial filter from URL hash ---
        const urlFilter = readURLHash();
        if (urlFilter && state.filterButtons.some((btn) => btn.dataset.filter === urlFilter)) {
            // Set active button without animation
            applyFilter(urlFilter, false);
        } else {
            // Ensure default is active
            updateActiveButton(CONFIG.defaultFilter);
        }

        // --- Listen for hash changes (browser back/forward) ---
        if (CONFIG.updateURL) {
            on(window, 'hashchange', handleHashChange);
        }

        // --- Listen for dynamic content ---
        document.addEventListener('content:changed', refreshCards);

        // --- Return API ---
        return {
            filter: applyFilter,
            refresh: refreshCards,
            getFilters: getAvailableFilters,
            count: countByFilter,
            getCurrent: () => state.currentFilter,
            reset: () => applyFilter(CONFIG.defaultFilter, true)
        };
    }

    /* ============================================================
       14. EXPOSE GLOBALLY
       ============================================================ */
    window.initFilters = initFilters;

})();