/* ============================================================
   NAVBAR.JS — Smart Navigation
   Sticky navbar + Active link tracking + Mobile menu
   + Scroll progress bar + Section indicator
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, throttle, debounce, clamp } = window.Utils;

    /* ============================================================
       1. STATE
       ============================================================ */
    const state = {
        navbar: null,
        navMenu: null,
        hamburger: null,
        navOverlay: null,
        navLinks: [],
        sections: [],
        indicatorDots: [],
        scrollProgress: null,
        backToTop: null,
        isMenuOpen: false,
        lastScrollY: 0,
        ticking: false
    };

    /* ============================================================
       2. STICKY NAVBAR (add .scrolled class)
       ============================================================ */
    function handleStickyNavbar() {
        const scrollY = window.pageYOffset;
        const threshold = 50;

        if (scrollY > threshold) {
            state.navbar.classList.add('scrolled');
        } else {
            state.navbar.classList.remove('scrolled');
        }
    }

    /* ============================================================
       3. HIDE / SHOW NAVBAR ON SCROLL DIRECTION
       (Optional — can be disabled by commenting out)
       ============================================================ */
    function handleNavbarVisibility() {
        const scrollY = window.pageYOffset;
        const diff = scrollY - state.lastScrollY;

        // Don't hide if mobile menu is open
        if (state.isMenuOpen) {
            state.lastScrollY = scrollY;
            return;
        }

        // Only act after scrolling past 300px
        if (scrollY > 300) {
            if (diff > 5) {
                // Scrolling down → hide
                state.navbar.classList.add('nav-hidden');
            } else if (diff < -5) {
                // Scrolling up → show
                state.navbar.classList.remove('nav-hidden');
            }
        } else {
            state.navbar.classList.remove('nav-hidden');
        }

        state.lastScrollY = scrollY;
    }

    /* ============================================================
       4. SCROLL PROGRESS BAR
       ============================================================ */
    function updateScrollProgress() {
        if (!state.scrollProgress) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        state.scrollProgress.style.width = `${clamp(progress, 0, 100)}%`;
    }

    /* ============================================================
       5. ACTIVE LINK TRACKING
       Uses IntersectionObserver for better performance
       ============================================================ */
    function initActiveLinkTracking() {
        const sections = $$('section[id]');
        if (!sections.length) return;

        state.sections = sections;

        const observerOptions = {
            root: null,
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    setActiveLink(id);
                    setActiveIndicator(id);
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    }

    function setActiveLink(id) {
        state.navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function setActiveIndicator(id) {
        state.indicatorDots.forEach((dot) => {
            const section = dot.dataset.section;
            if (section === id) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /* ============================================================
       6. SMOOTH SCROLL ON LINK CLICK
       ============================================================ */
    function handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // Only handle internal anchor links
        if (!href || !href.startsWith('#')) return;

        // Skip empty anchors (like "#")
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        if (state.isMenuOpen) {
            closeMobileMenu();
        }

        // Get navbar height for offset
        const navbarHeight = state.navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
            history.pushState(null, '', href);
        }
    }

    /* ============================================================
       7. MOBILE MENU
       ============================================================ */
    function openMobileMenu() {
        if (state.isMenuOpen) return;

        state.isMenuOpen = true;
        state.navMenu.classList.add('active');
        state.hamburger.classList.add('active');
        state.navOverlay.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px';

        // Update ARIA
        state.hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        if (!state.isMenuOpen) return;

        state.isMenuOpen = false;
        state.navMenu.classList.remove('active');
        state.hamburger.classList.remove('active');
        state.navOverlay.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Update ARIA
        state.hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileMenu() {
        if (state.isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /* ============================================================
       8. GET SCROLLBAR WIDTH (prevent layout shift)
       ============================================================ */
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    /* ============================================================
       9. BACK TO TOP BUTTON
       ============================================================ */
    function handleBackToTop() {
        const scrollY = window.pageYOffset;

        if (scrollY > 600) {
            state.backToTop.classList.add('show');
        } else {
            state.backToTop.classList.remove('show');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /* ============================================================
       10. UNIFIED SCROLL HANDLER
       ============================================================ */
    function onScroll() {
        if (!state.ticking) {
            window.requestAnimationFrame(() => {
                handleStickyNavbar();
                handleNavbarVisibility();
                updateScrollProgress();
                handleBackToTop();
                state.ticking = false;
            });
            state.ticking = true;
        }
    }

    /* ============================================================
       11. HANDLE RESIZE (close menu if desktop)
       ============================================================ */
    const handleResize = debounce(() => {
        if (window.innerWidth > 1024 && state.isMenuOpen) {
            closeMobileMenu();
        }
    }, 200);

    /* ============================================================
       12. HANDLE ESCAPE KEY
       ============================================================ */
    function handleKeydown(e) {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMobileMenu();
            state.hamburger.focus();
        }
    }

    /* ============================================================
       13. HANDLE CLICK OUTSIDE MENU
       ============================================================ */
    function handleOutsideClick(e) {
        if (!state.isMenuOpen) return;

        const isClickInsideMenu = state.navMenu.contains(e.target);
        const isClickOnHamburger = state.hamburger.contains(e.target);

        if (!isClickInsideMenu && !isClickOnHamburger) {
            closeMobileMenu();
        }
    }

    /* ============================================================
       14. INIT
       ============================================================ */
    function initNavbar() {
        // Find elements
        state.navbar = document.getElementById('navbar');
        state.navMenu = document.getElementById('navMenu');
        state.hamburger = document.getElementById('hamburger');
        state.navOverlay = document.getElementById('navOverlay');
        state.scrollProgress = document.getElementById('scrollProgress');
        state.backToTop = document.getElementById('backToTop');

        state.navLinks = $$('.nav-link');
        state.indicatorDots = $$('.indicator-dot');

        // Safety check
        if (!state.navbar) {
            console.warn('[Navbar] Navbar element not found');
            return null;
        }

        // --- Event Listeners ---

        // Scroll
        on(window, 'scroll', onScroll, { passive: true });

        // Nav links (smooth scroll)
        state.navLinks.forEach((link) => {
            on(link, 'click', handleLinkClick);
        });

        // Indicator dots (smooth scroll)
        state.indicatorDots.forEach((dot) => {
            on(dot, 'click', (e) => {
                e.preventDefault();
                const href = dot.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    window.Utils.scrollTo(target, state.navbar.offsetHeight);
                }
            });
        });

        // Hamburger
        if (state.hamburger) {
            on(state.hamburger, 'click', toggleMobileMenu);
        }

        // Overlay
        if (state.navOverlay) {
            on(state.navOverlay, 'click', closeMobileMenu);
        }

        // Back to top
        if (state.backToTop) {
            on(state.backToTop, 'click', scrollToTop);
        }

        // Resize
        on(window, 'resize', handleResize);

        // Escape key
        on(document, 'keydown', handleKeydown);

        // Click outside
        on(document, 'click', handleOutsideClick);

        // --- Initial calls ---
        handleStickyNavbar();
        updateScrollProgress();
        handleBackToTop();

        // --- Active link tracking ---
        initActiveLinkTracking();

        // --- Return API ---
        return {
            open: openMobileMenu,
            close: closeMobileMenu,
            toggle: toggleMobileMenu,
            isOpen: () => state.isMenuOpen,
            scrollToTop
        };
    }

    /* ============================================================
       15. EXPOSE GLOBALLY
       ============================================================ */
    window.initNavbar = initNavbar;

})();