/* ============================================================
   PARTICLES.JS — Interactive Particle Background
   Canvas-based particles with mouse interaction + connecting lines
   ============================================================ */

(function () {
    'use strict';

    const { on, lerp, random, clamp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ============================================================ */
    const CONFIG = {
        // Number of particles (will adapt to screen size)
        particleCount: {
            desktop: 80,
            tablet: 50,
            mobile: 25
        },
        // Particle size range (px)
        sizeMin: 1,
        sizeMax: 3,
        // Speed range (px per frame)
        speedMin: 0.15,
        speedMax: 0.5,
        // Mouse interaction
        mouseRadius: 180,       // Radius of mouse influence
        mouseForce: 0.03,       // How strongly particles react
        // Connection lines
        connectDistance: 140,   // Max distance to draw line
        lineWidth: 0.8,
        // Opacity
        particleOpacity: 0.6,
        lineOpacity: 0.15,
        // Colors (will be replaced by CSS variables if available)
        particleColor: '#61dafb',
        lineColor: '#61dafb',
        // FPS cap (0 = uncapped)
        fpsCap: 60,
        // Trail effect (0 = no trail, 1 = full clear)
        clearAlpha: 1
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;
    let isRunning = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse
    const mouse = {
        x: -9999,
        y: -9999,
        active: false,
        radius: CONFIG.mouseRadius
    };

    // Theme colors
    let themeColors = {
        particle: CONFIG.particleColor,
        line: CONFIG.lineColor
    };

    // FPS limiter
    let lastFrameTime = 0;
    const frameInterval = CONFIG.fpsCap > 0 ? 1000 / CONFIG.fpsCap : 0;

    /* ============================================================
       3. PARTICLE CLASS
       ============================================================ */
    class Particle {
        constructor() {
            this.reset();
            // Random initial position
            this.x = random(0, width);
            this.y = random(0, height);
        }

        reset() {
            this.x = random(0, width);
            this.y = random(0, height);
            this.vx = random(-CONFIG.speedMax, CONFIG.speedMax);
            this.vy = random(-CONFIG.speedMax, CONFIG.speedMax);
            this.size = random(CONFIG.sizeMin, CONFIG.sizeMax);

            // Ensure minimum speed (avoid stationary particles)
            if (Math.abs(this.vx) < CONFIG.speedMin) {
                this.vx = this.vx > 0 ? CONFIG.speedMin : -CONFIG.speedMin;
            }
            if (Math.abs(this.vy) < CONFIG.speedMin) {
                this.vy = this.vy > 0 ? CONFIG.speedMin : -CONFIG.speedMin;
            }
        }

        update() {
            // Apply mouse force (repel or attract)
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                const radiusSq = mouse.radius * mouse.radius;

                if (distSq < radiusSq && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / mouse.radius) * CONFIG.mouseForce;
                    const angle = Math.atan2(dy, dx);

                    this.vx += Math.cos(angle) * force * 10;
                    this.vy += Math.sin(angle) * force * 10;
                }
            }

            // Apply velocity
            this.x += this.vx;
            this.y += this.vy;

            // Damping (slow down over time)
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Clamp velocity
            const maxSpeed = CONFIG.speedMax * 3;
            this.vx = clamp(this.vx, -maxSpeed, maxSpeed);
            this.vy = clamp(this.vy, -maxSpeed, maxSpeed);

            // Wrap around edges
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = themeColors.particle;
            ctx.globalAlpha = CONFIG.particleOpacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    /* ============================================================
       4. CANVAS SETUP
       ============================================================ */
    function setupCanvas() {
        canvas = document.getElementById('particlesCanvas');
        if (!canvas) {
            console.warn('[Particles] Canvas element not found');
            return false;
        }

        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('[Particles] Could not get 2D context');
            return false;
        }

        resizeCanvas();
        return true;
    }

    function resizeCanvas() {
        if (!canvas) return;

        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        // Set canvas size (with DPR for retina)
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // Set display size
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // Scale context
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Update mouse radius based on screen size
        if (width < 768) {
            mouse.radius = 100;
        } else if (width < 1024) {
            mouse.radius = 140;
        } else {
            mouse.radius = CONFIG.mouseRadius;
        }
    }

    /* ============================================================
       5. PARTICLE COUNT (Adaptive)
       ============================================================ */
    function getParticleCount() {
        if (width < 768) return CONFIG.particleCount.mobile;
        if (width < 1024) return CONFIG.particleCount.tablet;
        return CONFIG.particleCount.desktop;
    }

    /* ============================================================
       6. CREATE PARTICLES
       ============================================================ */
    function createParticles() {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    /* ============================================================
       7. DRAW CONNECTIONS (Lines between nearby particles)
       ============================================================ */
    function drawConnections() {
        const maxDistSq = CONFIG.connectDistance * CONFIG.connectDistance;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / CONFIG.connectDistance) * CONFIG.lineOpacity;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = themeColors.line;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = CONFIG.lineWidth;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    /* ============================================================
       8. DRAW MOUSE CONNECTIONS
       Lines from particles to mouse
       ============================================================ */
    function drawMouseConnections() {
        if (!mouse.active) return;

        const maxDistSq = mouse.radius * mouse.radius;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
                const dist = Math.sqrt(distSq);
                const opacity = (1 - dist / mouse.radius) * 0.35;

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = themeColors.line;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }

    /* ============================================================
       9. ANIMATION LOOP
       ============================================================ */
    function animate(timestamp) {
        if (!isRunning) return;

        // FPS limiter
        if (CONFIG.fpsCap > 0) {
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < frameInterval) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = timestamp - (elapsed % frameInterval);
        }

        // Clear canvas
        ctx.globalAlpha = CONFIG.clearAlpha;
        ctx.fillStyle = getBackgroundColor();
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;

        // Update particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Draw connections (behind particles)
        drawConnections();
        drawMouseConnections();

        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
        }

        animationId = requestAnimationFrame(animate);
    }

    /* ============================================================
       10. GET BACKGROUND COLOR (adapts to theme)
       ============================================================ */
    function getBackgroundColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '#f8fafc' : '#0a0e27';
    }

    /* ============================================================
       11. UPDATE THEME COLORS
       ============================================================ */
    function updateThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme');

        if (theme === 'light') {
            themeColors.particle = '#21a1c4';
            themeColors.line = '#21a1c4';
        } else {
            themeColors.particle = '#61dafb';
            themeColors.line = '#61dafb';
        }
    }

    /* ============================================================
       12. MOUSE HANDLERS
       ============================================================ */
    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }

    function onMouseLeave() {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
    }

    function onMouseEnter() {
        mouse.active = true;
    }

    /* ============================================================
       13. HANDLE RESIZE
       ============================================================ */
    const handleResize = window.Utils.debounce(() => {
        resizeCanvas();
        createParticles();
    }, 250);

    /* ============================================================
       14. HANDLE VISIBILITY CHANGE
       Pause animation when tab is hidden (save battery)
       ============================================================ */
    function onVisibilityChange() {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    }

    /* ============================================================
       15. START / STOP
       ============================================================ */
    function start() {
        if (isRunning) return;
        isRunning = true;
        lastFrameTime = 0;
        animationId = requestAnimationFrame(animate);
    }

    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    /* ============================================================
       16. INIT
       ============================================================ */
    function initParticles() {
        // Skip on reduced motion
        if (window.Utils.prefersReducedMotion()) {
            console.log('[Particles] Skipped (reduced motion)');
            return null;
        }

        // Setup canvas
        if (!setupCanvas()) return null;

        // Initial theme colors
        updateThemeColors();

        // Create particles
        createParticles();

        // Attach listeners
        on(document, 'mousemove', onMouseMove, { passive: true });
        on(document, 'mouseleave', onMouseLeave);
        on(document, 'mouseenter', onMouseEnter);
        on(window, 'resize', handleResize);
        on(document, 'visibilitychange', onVisibilityChange);

        // Listen to theme changes
        document.addEventListener('theme:changed', () => {
            updateThemeColors();
        });

        // Start animation
        start();

        // Return API
        return {
            start,
            stop,
            restart: () => {
                stop();
                createParticles();
                start();
            },
            setCount: (n) => {
                CONFIG.particleCount.desktop = n;
                createParticles();
            }
        };
    }

    /* ============================================================
       17. EXPOSE GLOBALLY
       ============================================================ */
    window.initParticles = initParticles;

})();