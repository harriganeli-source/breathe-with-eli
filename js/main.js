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
    document.querySelectorAll('.service-card, .testimonial-quote, .testimonial-card, .event-card, .intro-content, .intro--with-image .two-col').forEach(el => {
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

// Kit (ConvertKit) form handling is done by Kit's official script
// loaded via: https://breathe-with-eli.kit.com/7a97c5385b/index.js

// Interactive Hover Mandala with breathing animation
(function() {
    const isMobile = window.innerWidth <= 768;
    const container = isMobile
        ? document.getElementById('hero-mandala-mobile')
        : document.getElementById('hero-mandala');
    const heroSection = document.querySelector('.hero--mandala');
    if (!container || !heroSection) return;

    const numChevrons = isMobile ? 12 : 24;
    const baseRadius = isMobile ? 60 : 340;
    const breathAmount = 6; // How much the radius changes during breathing
    const hoverExpandAmount = 40; // Additional expansion on hover
    const breathDuration = 8000; // 8 seconds per breath cycle
    const hoverEaseSpeed = 0.015; // How fast hover offset interpolates (0-1, lower = smoother)
    const chevrons = [];
    const chevronState = []; // Store current and target hover offsets

    // Page-load entrance animation settings
    const entranceDelay = 300; // ms before animation starts
    const entranceDuration = 2000; // ms for full entrance animation (slower, more relaxed)
    const entranceStartRadius = 1.4; // Start 40% wider than final position
    const entranceStartTime = Date.now() + entranceDelay;
    let entranceComplete = false;
    let bottomChevronFlipped = false;
    // Bottom chevron calculation: cos(angle)*radius gives X, sin(angle)*radius gives Y
    // For bottom of screen, we want max Y (positive), which is sin(angle) = 1, meaning angle = π/2
    // Since angle = (i/numChevrons) * 2π, we need i/numChevrons = 0.25 for angle = π/2
    const bottomChevronIndex = Math.floor(numChevrons * 0.25); // Bottom chevron (at π/2 radians, max Y on screen)

    // Create chevron elements arranged in a circle
    for (let i = 0; i < numChevrons; i++) {
        const angle = (i / numChevrons) * Math.PI * 2;
        const chevron = document.createElement('div');
        chevron.className = 'chevron';

        // Rotate to point outward
        const rotation = (angle * 180 / Math.PI) + 90;
        chevron.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        // Start with reduced opacity for entrance animation
        chevron.style.opacity = '0';

        // Set color gradient - hue shift around the ring
        // Base color is sage green (around 100 on hue wheel)
        // Shift from warm gold/olive (60) at top to cool teal (140) at bottom
        const hueShift = (i / numChevrons) * 80 - 40; // -40 to +40 range for more visible gradient
        chevron.style.setProperty('--chevron-hue', 100 + hueShift);

        container.appendChild(chevron);
        chevrons.push(chevron);
        chevronState.push({
            angle: angle,
            currentOffset: 0,
            targetOffset: 0,
            collapseTimeout: null,
            // Stagger entrance by angle - top chevrons appear first, rippling around
            entranceStagger: i * (300 / numChevrons)
        });
    }

    function updateChevronPosition(index, breathProgress, now) {
        const chevron = chevrons[index];
        const state = chevronState[index];

        // Smoothly interpolate current offset toward target
        state.currentOffset += (state.targetOffset - state.currentOffset) * hoverEaseSpeed;

        // Calculate entrance animation progress
        let entranceProgress = 1;
        let entranceRadiusMultiplier = 1;
        let entranceOpacity = 1;

        if (!entranceComplete) {
            const entranceElapsed = now - entranceStartTime - state.entranceStagger;
            if (entranceElapsed < 0) {
                entranceProgress = 0;
            } else if (entranceElapsed < entranceDuration) {
                // Ease-out cubic for smooth deceleration (settling feel)
                const t = entranceElapsed / entranceDuration;
                entranceProgress = 1 - Math.pow(1 - t, 3);
            }
            // Chevrons start from wider radius and contract inward to final position
            // entranceStartRadius (1.4) -> 1.0 as entranceProgress goes 0 -> 1
            entranceRadiusMultiplier = entranceStartRadius - (entranceStartRadius - 1) * entranceProgress;
            // Fade in during first third of entrance
            entranceOpacity = Math.min(1, entranceProgress * 3);
        }

        // Calculate breathing radius (sine wave)
        const breathOffset = Math.sin(breathProgress * Math.PI * 2) * breathAmount;
        const currentRadius = (baseRadius + breathOffset + state.currentOffset) * entranceRadiusMultiplier;

        const x = Math.cos(state.angle) * currentRadius;
        const y = Math.sin(state.angle) * currentRadius;

        chevron.style.left = `calc(50% + ${x}px)`;
        chevron.style.top = `calc(50% + ${y}px)`;
        chevron.style.opacity = entranceOpacity;

        // Handle bottom chevron flip to become scroll indicator
        if (index === bottomChevronIndex && bottomChevronFlipped) {
            // The chevron base shape ">" points right at 0deg
            // But the bottom chevron already has 180deg rotation applied (pointing left/outward)
            // To flip it to point DOWN as a scroll indicator, we need to rotate it
            // from pointing outward (away from center) to pointing down
            // Testing with 0deg - the raw chevron shape points right, let's see what we get
            chevron.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        }
    }

    // Breathing animation loop
    function animateBreathing() {
        const now = Date.now();
        const breathProgress = (now % breathDuration) / breathDuration;

        for (let i = 0; i < chevrons.length; i++) {
            updateChevronPosition(i, breathProgress, now);
        }

        // Check if entrance animation is complete
        if (!entranceComplete) {
            const lastChevronFinish = entranceStartTime + chevronState[chevronState.length - 1].entranceStagger + entranceDuration;
            if (now > lastChevronFinish) {
                entranceComplete = true;
                // On desktop only: flip the bottom chevron to point down as scroll indicator
                // On mobile: keep the separate scroll-indicator visible instead
                if (!isMobile) {
                    setTimeout(() => {
                        bottomChevronFlipped = true;
                        const bottomChevron = chevrons[bottomChevronIndex];
                        bottomChevron.classList.add('scroll-chevron');
                        // Make it clickable to scroll to intro section
                        bottomChevron.addEventListener('click', () => {
                            const intro = document.getElementById('intro');
                            if (intro) {
                                const navHeight = document.querySelector('.navbar').offsetHeight;
                                const targetPosition = intro.getBoundingClientRect().top + window.pageYOffset - navHeight;
                                window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        });
                    }, 1500); // 1.5 second delay after entrance completes
                }
            }
        }

        requestAnimationFrame(animateBreathing);
    }

    function expandChevron(index) {
        const state = chevronState[index];
        state.targetOffset = hoverExpandAmount;

        // Clear any existing collapse timeout
        if (state.collapseTimeout) {
            clearTimeout(state.collapseTimeout);
        }

        // Set new collapse timeout (delay before returning)
        state.collapseTimeout = setTimeout(() => {
            collapseChevron(index);
        }, 800);
    }

    function collapseChevron(index) {
        const state = chevronState[index];
        state.targetOffset = 0;
        state.collapseTimeout = null;
    }

    // Mouse interaction on the whole hero section
    heroSection.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        for (let i = 0; i < chevronState.length; i++) {
            const state = chevronState[i];
            // Calculate base position for distance check
            const checkX = Math.cos(state.angle) * baseRadius;
            const checkY = Math.sin(state.angle) * baseRadius;

            // Check distance from mouse to chevron base position
            const dx = mouseX - checkX;
            const dy = mouseY - checkY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 70) {
                expandChevron(i);
            }
        }
    });

    // Start breathing animation
    animateBreathing();
})();

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

// Interactive Heart Mandala with circles and breathing animation (Inner Beloved page)
(function() {
    const isMobile = window.innerWidth <= 768;
    const container = isMobile
        ? document.getElementById('hero-heart-mandala-mobile')
        : document.getElementById('hero-heart-mandala');
    const heroSection = document.querySelector('.hero--heart');
    if (!container || !heroSection) return;

    const numDots = isMobile ? 24 : 40;
    const baseScale = isMobile ? 7 : 22;
    const dotSize = isMobile ? 10 : 14;
    const breathAmount = 6; // How much the heart "breathes" (percentage)
    const breathDuration = 8000; // 8 seconds per breath cycle
    const hoverExpandAmount = 35; // Additional expansion on hover (percentage)
    const hoverEaseSpeed = 0.02;
    const dots = [];
    const dotState = [];

    // Page-load entrance animation settings
    const entranceDelay = 300;
    const entranceDuration = 2000;
    const entranceStartScale = 1.5;
    const entranceStartTime = Date.now() + entranceDelay;
    let entranceComplete = false;

    // Heart shape parametric equation
    // Uses the classic heart curve: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    function heartPoint(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    }

    // Pre-calculate arc lengths to distribute dots evenly
    // Sample many points and calculate cumulative distance
    const sampleCount = 1000;
    const arcLengths = [0];
    let prevPoint = heartPoint(0);

    for (let i = 1; i <= sampleCount; i++) {
        const t = (i / sampleCount) * Math.PI * 2;
        const point = heartPoint(t);
        const dx = point.x - prevPoint.x;
        const dy = point.y - prevPoint.y;
        arcLengths.push(arcLengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
        prevPoint = point;
    }

    const totalLength = arcLengths[sampleCount];

    // Find parameter t for a given arc length fraction
    function tForArcFraction(fraction) {
        const targetLength = fraction * totalLength;
        // Binary search for the right sample index
        let low = 0, high = sampleCount;
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (arcLengths[mid] < targetLength) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        // Interpolate between samples
        if (low === 0) return 0;
        const prevLength = arcLengths[low - 1];
        const nextLength = arcLengths[low];
        const segmentFraction = (targetLength - prevLength) / (nextLength - prevLength);
        return ((low - 1 + segmentFraction) / sampleCount) * Math.PI * 2;
    }

    // Create dot elements arranged in heart shape with even spacing
    for (let i = 0; i < numDots; i++) {
        const arcFraction = i / numDots;
        const t = tForArcFraction(arcFraction);
        const dot = document.createElement('div');
        dot.className = 'heart-dot';

        // Set dot size
        dot.style.width = dotSize + 'px';
        dot.style.height = dotSize + 'px';

        // Start with reduced opacity for entrance animation
        dot.style.opacity = '0';

        // Consistent pink color for all dots
        dot.style.setProperty('--dot-hue', 340);

        container.appendChild(dot);
        dots.push(dot);
        dotState.push({
            t: t,
            currentOffset: 0,
            targetOffset: 0,
            collapseTimeout: null,
            entranceStagger: i * (400 / numDots)
        });
    }

    function updateDotPosition(index, breathProgress, now) {
        const dot = dots[index];
        const state = dotState[index];

        // Smoothly interpolate current offset toward target
        state.currentOffset += (state.targetOffset - state.currentOffset) * hoverEaseSpeed;

        // Calculate entrance animation progress
        let entranceProgress = 1;
        let entranceScaleMultiplier = 1;
        let entranceOpacity = 1;

        if (!entranceComplete) {
            const entranceElapsed = now - entranceStartTime - state.entranceStagger;
            if (entranceElapsed < 0) {
                entranceProgress = 0;
            } else if (entranceElapsed < entranceDuration) {
                const t = entranceElapsed / entranceDuration;
                entranceProgress = 1 - Math.pow(1 - t, 3);
            }
            entranceScaleMultiplier = entranceStartScale - (entranceStartScale - 1) * entranceProgress;
            entranceOpacity = Math.min(1, entranceProgress * 3);
        }

        // Calculate breathing scale (sine wave)
        const breathScale = 1 + Math.sin(breathProgress * Math.PI * 2) * (breathAmount / 100);

        // Add hover offset
        const hoverScale = 1 + (state.currentOffset / 100);

        // Get heart position
        const point = heartPoint(state.t);
        const totalScale = baseScale * breathScale * hoverScale * entranceScaleMultiplier;
        const x = point.x * totalScale;
        const y = point.y * totalScale;

        dot.style.left = `calc(50% + ${x}px)`;
        dot.style.top = `calc(50% + ${y}px)`;
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.opacity = entranceOpacity * 0.7;
    }

    // Breathing animation loop
    function animateBreathing() {
        const now = Date.now();
        const breathProgress = (now % breathDuration) / breathDuration;

        for (let i = 0; i < dots.length; i++) {
            updateDotPosition(i, breathProgress, now);
        }

        // Check if entrance animation is complete
        if (!entranceComplete) {
            const lastDotFinish = entranceStartTime + dotState[dotState.length - 1].entranceStagger + entranceDuration;
            if (now > lastDotFinish) {
                entranceComplete = true;
            }
        }

        requestAnimationFrame(animateBreathing);
    }

    function expandDot(index) {
        const state = dotState[index];
        state.targetOffset = hoverExpandAmount;

        if (state.collapseTimeout) {
            clearTimeout(state.collapseTimeout);
        }

        state.collapseTimeout = setTimeout(() => {
            collapseDot(index);
        }, 800);
    }

    function collapseDot(index) {
        const state = dotState[index];
        state.targetOffset = 0;
        state.collapseTimeout = null;
    }

    // Mouse interaction on the whole hero section (desktop only)
    if (!isMobile) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            for (let i = 0; i < dotState.length; i++) {
                const state = dotState[i];
                const point = heartPoint(state.t);
                const checkX = point.x * baseScale;
                const checkY = point.y * baseScale;

                const dx = mouseX - checkX;
                const dy = mouseY - checkY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    expandDot(i);
                }
            }
        });
    }

    // Start breathing animation
    animateBreathing();
})();
