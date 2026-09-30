/* ============================================================
   ENHANCEMENTS.JS — Loader, Cursor, Filter, Counters,
   Magnetic Buttons, Scroll Progress, Testimonials Reveal
   ============================================================ */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    /* ---------- 1. LOADING SCREEN ---------- */
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        const progress = loader.querySelector('.loader-progress');
        let pct = 0;

        const tick = setInterval(() => {
            pct = Math.min(pct + Math.random() * 18, 90);
            if (progress) progress.style.width = pct + '%';
        }, 120);

        const finish = () => {
            clearInterval(tick);
            if (progress) progress.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('is-hidden');
                document.body.style.overflow = '';
                document.dispatchEvent(new CustomEvent('loader:done'));
            }, 400);
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('load', finish);
        // Fallback if load takes too long
        setTimeout(finish, 3500);
    }

    /* ---------- 2. CUSTOM CURSOR ---------- */
    function initCursor() {
        if (isTouch || prefersReduced) return;

        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        if (!dot || !ring) return;

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx, ry = my;

        document.body.classList.add('has-cursor');

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });

        const animate = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(animate);
        };
        animate();

        const interactive = 'a, button, input, textarea, .tech, .filter-btn, .testimonial-card';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactive)) ring.classList.add('is-hover');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactive)) ring.classList.remove('is-hover');
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        });
    }

    /* ---------- 3. SCROLL PROGRESS BAR ---------- */
    function initScrollProgress() {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;

        const update = () => {
            const scrollTop = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const pct = height > 0 ? (scrollTop / height) * 100 : 0;
            bar.style.width = pct + '%';
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ---------- 4. NUMBER COUNTERS ---------- */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach((c) => {
                c.textContent = (c.dataset.target || 0) + '+';
            });
            return;
        }

        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1600;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + '+';
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((c) => io.observe(c));
    }

    /* ---------- 5. MAGNETIC BUTTONS ---------- */
    function initMagnetic() {
        if (isTouch || prefersReduced) return;

        document.querySelectorAll('.magnetic').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ---------- 6. PROJECTS FILTER ---------- */
    function initProjectFilter() {
        const buttons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project');
        if (!buttons.length || !projects.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                buttons.forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                projects.forEach((p) => {
                    const match = filter === 'all' || p.dataset.category === filter;
                    if (match) {
                        p.classList.remove('is-filtered-out');
                        p.style.animation = 'none';
                        // Force reflow
                        void p.offsetWidth;
                        p.style.animation = 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
                    } else {
                        p.classList.add('is-filtered-out');
                    }
                });
            });
        });

        // Inject keyframes once
        if (!document.getElementById('filterKeyframes')) {
            const style = document.createElement('style');
            style.id = 'filterKeyframes';
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ---------- 7. TYPEWRITER ROLES ---------- */
    function initTypewriter() {
        const el = document.querySelector('.typewriter');
        if (!el || prefersReduced) return;

        const roles = {
            en: ['Front-End Developer', 'React Specialist', 'UI Craftsman', 'Tailwind Expert'],
            ar: ['مطور واجهات أمامية', 'متخصص React', 'صانع واجهات', 'خبير Tailwind']
        };

        let lang = document.documentElement.getAttribute('lang') || 'en';
        let idx = 0;
        let charIdx = 0;
        let deleting = false;
        let currentText = roles[lang][0];

        const tick = () => {
            const list = roles[lang];
            const target = list[idx % list.length];

            if (!deleting) {
                charIdx++;
                currentText = target.slice(0, charIdx);
                if (charIdx >= target.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    el.textContent = currentText;
                    return;
                }
            } else {
                charIdx--;
                currentText = target.slice(0, charIdx);
                if (charIdx <= 0) {
                    deleting = false;
                    idx++;
                    el.textContent = '';
                    setTimeout(tick, 300);
                    return;
                }
            }

            el.textContent = currentText;
            setTimeout(tick, deleting ? 40 : 90);
        };

        // Start after loader
        document.addEventListener('loader:done', () => setTimeout(tick, 400));
        setTimeout(tick, 2000); // fallback

        // React to language changes
        document.addEventListener('lang:changed', (e) => {
            lang = e.detail.lang;
            idx = 0;
            charIdx = 0;
            deleting = false;
        });
    }

    /* ---------- 8. TESTIMONIALS REVEAL ---------- */
    function initTestimonialReveal() {
        const cards = document.querySelectorAll('.testimonial-card');
        if (!cards.length) return;

        if (!('IntersectionObserver' in window)) {
            cards.forEach((c) => c.classList.add('is-visible'));
            return;
        }

        cards.forEach((c) => c.classList.add('reveal'));

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('is-visible'), i * 120);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        cards.forEach((c) => io.observe(c));
    }

    /* ---------- 9. BOOT ---------- */
    function boot() {
        initLoader();
        initCursor();
        initScrollProgress();
        initCounters();
        initMagnetic();
        initProjectFilter();
        initTypewriter();
        initTestimonialReveal();

        console.log(
            '%c✨ Enhancements Loaded',
            'color:#06b6d4; font-weight:bold; font-size:13px;'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();