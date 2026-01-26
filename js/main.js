// ============================================
// BREATHE WITH ELI - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Simple fade-in animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    document.querySelectorAll('.service-card, .testimonial-quote, .event-card').forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });

    // Synchronize service icon breathing animations
    // Use a single JavaScript timer to drive all icons together
    const serviceIcons = document.querySelectorAll('.service-icon svg');
    if (serviceIcons.length > 0) {
        const duration = 5000; // 5 seconds per breath cycle

        function animateBreath() {
            const now = Date.now();
            const progress = (now % duration) / duration;
            // Sine wave: 0 -> 1 -> 0 over the cycle
            const breathProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
            const scale = 1 + (breathProgress * 0.15); // 1.0 to 1.15

            serviceIcons.forEach(icon => {
                icon.style.setProperty('--breath-scale', scale);
                icon.style.setProperty('--breath-progress', breathProgress);
            });

            requestAnimationFrame(animateBreath);
        }

        animateBreath();
    }
});

// Add CSS for fade-in animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .navbar.scrolled {
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    }
    body.nav-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// FAQ Accordion Toggle
function toggleFaq(button) {
    const faqItem = button.parentElement;
    faqItem.classList.toggle('active');
}

// Interactive Breath Wave - Trailing Line
(function() {
    const container = document.querySelector('.breath-wave-container');
    if (!container) return;

    const canvas = container.querySelector('.breath-canvas');
    const breathText = container.querySelector('.breath-text');
    const labelTop = container.querySelector('.breath-label--top');
    const labelBottom = container.querySelector('.breath-label--bottom');

    if (!canvas || !breathText) return;

    const ctx = canvas.getContext('2d');

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    // Settings
    const padding = 40;
    const lineWidth = 2;
    const scrollSpeed = 0.8;     // How fast the line flows left-to-right (pixels per frame)
    const maxMoveSpeed = 0.002;  // Max amount head can move per frame (very slow = smooth waves)

    // History buffer - stores Y positions that flow from left to right
    // Need enough entries to cover the full width of the canvas
    const historyLength = Math.ceil(width) + 50;
    const history = new Array(historyLength).fill(0.5);
    let historyOffset = 0;       // Sub-pixel offset for smooth scrolling

    // Current state
    let targetY = 0.5;           // Where cursor wants the head
    let currentY = 0.5;          // Current head position (rate-limited)
    let lastTargetY = 0.5;
    let currentState = 'breathe';
    let isHovering = false;

    // Get CSS color
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--color-primary').trim() || '#4a5d4a';

    function getVerticalPosition(clientY) {
        const r = container.getBoundingClientRect();
        const relativeY = (clientY - r.top) / r.height;
        return Math.max(0, Math.min(1, relativeY));
    }

    function updateBreathState(cursorY) {
        const isNearTop = cursorY < 0.2;
        const isNearBottom = cursorY > 0.8;
        const cursorDelta = cursorY - lastTargetY;
        const isMoving = Math.abs(cursorDelta) > 0.003;

        if (!isMoving && isNearTop) {
            if (currentState !== 'hold') {
                currentState = 'hold';
                breathText.textContent = 'hold';
                if (labelTop) labelTop.classList.add('active');
                if (labelBottom) labelBottom.classList.remove('active');
            }
        } else if (!isMoving && isNearBottom) {
            if (currentState !== 'hold') {
                currentState = 'hold';
                breathText.textContent = 'hold';
                if (labelTop) labelTop.classList.remove('active');
                if (labelBottom) labelBottom.classList.add('active');
            }
        } else if (cursorDelta < -0.003) {
            if (currentState !== 'inhale') {
                currentState = 'inhale';
                breathText.textContent = 'inhale';
                if (labelTop) labelTop.classList.add('active');
                if (labelBottom) labelBottom.classList.remove('active');
            }
        } else if (cursorDelta > 0.003) {
            if (currentState !== 'exhale') {
                currentState = 'exhale';
                breathText.textContent = 'exhale';
                if (labelTop) labelTop.classList.remove('active');
                if (labelBottom) labelBottom.classList.add('active');
            }
        }

        lastTargetY = cursorY;
    }

    function draw() {
        // Move head toward target with max speed limit
        const delta = targetY - currentY;
        if (Math.abs(delta) > maxMoveSpeed) {
            currentY += Math.sign(delta) * maxMoveSpeed;
        } else {
            currentY = targetY;
        }

        // Update history offset for smooth scrolling
        historyOffset += scrollSpeed;

        // When we've scrolled enough, shift the history
        while (historyOffset >= 1) {
            historyOffset -= 1;
            history.pop();
            history.unshift(currentY);
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw subtle guide lines at top and bottom
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, padding);
        ctx.lineTo(width, padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height - padding);
        ctx.lineTo(width, height - padding);
        ctx.stroke();

        ctx.globalAlpha = 1;

        // Draw the flowing line from history - simple pixel-by-pixel for smoothest result
        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Start at x=0
        const startIndex = Math.floor(historyOffset);
        const startY = padding + (history[startIndex] || 0.5) * (height - padding * 2);
        ctx.moveTo(0, startY);

        // Draw line pixel by pixel across full width
        for (let x = 1; x <= width; x++) {
            const historyIndex = Math.floor(x + historyOffset);
            const yValue = history[Math.min(historyIndex, history.length - 1)] || 0.5;
            const y = padding + yValue * (height - padding * 2);
            ctx.lineTo(x, y);
        }

        ctx.stroke();

        requestAnimationFrame(draw);
    }

    function handleInteraction(clientY) {
        targetY = getVerticalPosition(clientY);
        updateBreathState(targetY);

        if (!isHovering) {
            isHovering = true;
            container.classList.add('interactive');
        }
    }

    function handleMouseLeave() {
        isHovering = false;
        currentState = 'breathe';
        breathText.textContent = 'breathe';
        if (labelTop) labelTop.classList.remove('active');
        if (labelBottom) labelBottom.classList.remove('active');

        // Return to center
        targetY = 0.5;
        lastTargetY = 0.5;

        setTimeout(() => {
            if (!isHovering) {
                container.classList.remove('interactive');
            }
        }, 1000);
    }

    // Listen on the entire intro section for wider interaction area
    const introSection = container.closest('.intro');
    const interactionTarget = introSection || container;

    interactionTarget.addEventListener('mousemove', (e) => {
        handleInteraction(e.clientY);
    });

    interactionTarget.addEventListener('mouseleave', handleMouseLeave);

    // Touch support
    interactionTarget.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleInteraction(e.touches[0].clientY);
        }
    }, { passive: true });

    interactionTarget.addEventListener('touchend', handleMouseLeave);

    // Start animation
    draw();
})();
