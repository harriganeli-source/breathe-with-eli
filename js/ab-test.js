/**
 * A/B Testing & Engagement Tracking
 * Tracks headline variants and comprehensive user engagement
 * Sends data to both Google Analytics and Vercel Analytics
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const AB_TEST_CONFIG = {
        testName: 'homepage_headline_v1',
        storageKey: 'ab_headline_variant',
        variants: {
            A: 'Come Home to Yourself',
            B: 'Find Your Ground.'
        }
    };

    // Engagement tracking thresholds
    const SCROLL_MILESTONES = [25, 50, 75, 100];
    const TIME_MILESTONES = [30, 60, 120, 300]; // seconds

    // ============================================
    // VARIANT ASSIGNMENT
    // ============================================
    function getOrAssignVariant() {
        let variant = localStorage.getItem(AB_TEST_CONFIG.storageKey);

        if (!variant || !['A', 'B'].includes(variant)) {
            // Randomly assign 50/50
            variant = Math.random() < 0.5 ? 'A' : 'B';
            localStorage.setItem(AB_TEST_CONFIG.storageKey, variant);
        }

        return variant;
    }

    function applyHeadline(variant) {
        const headline = document.querySelector('.hero-content h1');
        if (headline) {
            headline.textContent = AB_TEST_CONFIG.variants[variant];
        }
    }

    // ============================================
    // ANALYTICS HELPERS
    // ============================================
    function trackEvent(eventName, params = {}) {
        const variant = getOrAssignVariant();
        const enrichedParams = {
            ...params,
            ab_test: AB_TEST_CONFIG.testName,
            ab_variant: variant,
            headline: AB_TEST_CONFIG.variants[variant]
        };

        // Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', eventName, enrichedParams);
        }

        // Vercel Analytics (if available)
        if (typeof window.va === 'function') {
            window.va('event', { name: eventName, ...enrichedParams });
        }

        // Debug logging (remove in production if desired)
        console.log('[AB Test]', eventName, enrichedParams);
    }

    // ============================================
    // SCROLL DEPTH TRACKING
    // ============================================
    function initScrollTracking() {
        const trackedMilestones = new Set();

        function getScrollPercent() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            return Math.round((scrollTop / scrollHeight) * 100);
        }

        function checkScrollMilestones() {
            const percent = getScrollPercent();

            SCROLL_MILESTONES.forEach(milestone => {
                if (percent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    trackEvent('scroll_depth', {
                        depth_percent: milestone,
                        depth_threshold: `${milestone}%`
                    });
                }
            });
        }

        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(function() {
                checkScrollMilestones();
                scrollTimeout = null;
            }, 100);
        }, { passive: true });
    }

    // ============================================
    // TIME ON PAGE TRACKING
    // ============================================
    function initTimeTracking() {
        const startTime = Date.now();
        const trackedMilestones = new Set();

        function checkTimeMilestones() {
            const secondsOnPage = Math.floor((Date.now() - startTime) / 1000);

            TIME_MILESTONES.forEach(milestone => {
                if (secondsOnPage >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    trackEvent('time_on_page', {
                        seconds: milestone,
                        time_threshold: `${milestone}s`
                    });
                }
            });
        }

        // Check every 5 seconds
        setInterval(checkTimeMilestones, 5000);
    }

    // ============================================
    // CLICK TRACKING
    // ============================================
    function initClickTracking() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button, .btn');
            if (!target) return;

            const isHeroButton = target.closest('.hero-buttons');
            const isNavCTA = target.classList.contains('nav-cta');
            const isCTASection = target.closest('.cta');

            // Determine click context
            let clickContext = 'general';
            let clickLabel = '';

            if (isHeroButton) {
                clickContext = 'hero';
                clickLabel = target.textContent.trim();

                // Track hero button specifically
                trackEvent('hero_button_click', {
                    button_text: clickLabel,
                    button_type: target.classList.contains('btn-primary') ? 'primary' : 'secondary',
                    destination_url: target.href || ''
                });
            } else if (isNavCTA) {
                clickContext = 'navigation';
                clickLabel = target.textContent.trim();
            } else if (isCTASection) {
                clickContext = 'cta_section';
                clickLabel = target.textContent.trim();
            } else if (target.closest('.service-card')) {
                clickContext = 'services';
                clickLabel = target.textContent.trim();
            } else if (target.closest('.event-card')) {
                clickContext = 'events';
                const eventCard = target.closest('.event-card');
                const eventName = eventCard.querySelector('h3')?.textContent || '';
                clickLabel = eventName;
            } else if (target.closest('.testimonial-card, .testimonial')) {
                clickContext = 'testimonials';
                clickLabel = target.textContent.trim();
            } else {
                clickLabel = target.textContent.trim().substring(0, 50);
            }

            // Track all link/button clicks
            trackEvent('click', {
                click_context: clickContext,
                click_label: clickLabel,
                element_type: target.tagName.toLowerCase(),
                destination_url: target.href || '',
                classes: target.className
            });
        });
    }

    // ============================================
    // FORM TRACKING
    // ============================================
    function initFormTracking() {
        // Track Kit form interactions
        // Kit forms are loaded dynamically, so we use MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Look for Kit form elements
                        const forms = node.querySelectorAll ?
                            node.querySelectorAll('form[data-sv-form], form[action*="kit.com"], form[action*="convertkit"]') : [];

                        forms.forEach(function(form) {
                            if (!form.dataset.abTracked) {
                                form.dataset.abTracked = 'true';

                                form.addEventListener('submit', function() {
                                    trackEvent('form_submit', {
                                        form_type: 'newsletter_signup',
                                        form_location: 'homepage_cta'
                                    });
                                });

                                // Track form field focus
                                const emailInput = form.querySelector('input[type="email"]');
                                if (emailInput) {
                                    emailInput.addEventListener('focus', function() {
                                        trackEvent('form_interaction', {
                                            interaction_type: 'email_field_focus',
                                            form_location: 'homepage_cta'
                                        });
                                    }, { once: true });
                                }
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Also check for already-loaded forms
        document.querySelectorAll('form').forEach(function(form) {
            if (!form.dataset.abTracked) {
                form.dataset.abTracked = 'true';
                form.addEventListener('submit', function() {
                    trackEvent('form_submit', {
                        form_type: 'general',
                        form_location: 'homepage'
                    });
                });
            }
        });
    }

    // ============================================
    // PAGE VISIBILITY TRACKING
    // ============================================
    function initVisibilityTracking() {
        let hiddenTime = null;

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                hiddenTime = Date.now();
            } else if (hiddenTime) {
                const awayDuration = Math.floor((Date.now() - hiddenTime) / 1000);
                trackEvent('page_visibility', {
                    action: 'returned',
                    away_seconds: awayDuration
                });
                hiddenTime = null;
            }
        });
    }

    // ============================================
    // EXIT INTENT TRACKING
    // ============================================
    function initExitIntentTracking() {
        let exitTracked = false;

        document.addEventListener('mouseout', function(e) {
            if (exitTracked) return;

            // Check if mouse left through top of viewport
            if (e.clientY < 10 && e.relatedTarget === null) {
                exitTracked = true;
                trackEvent('exit_intent', {
                    trigger: 'mouse_leave_top'
                });
            }
        });
    }

    // ============================================
    // INITIAL PAGE VIEW TRACKING
    // ============================================
    function trackPageView() {
        const variant = getOrAssignVariant();

        trackEvent('ab_page_view', {
            page: window.location.pathname,
            referrer: document.referrer,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Apply headline immediately to prevent flash
        const variant = getOrAssignVariant();

        // Wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                applyHeadline(variant);
                initAllTracking();
            });
        } else {
            applyHeadline(variant);
            initAllTracking();
        }
    }

    function initAllTracking() {
        trackPageView();
        initScrollTracking();
        initTimeTracking();
        initClickTracking();
        initFormTracking();
        initVisibilityTracking();
        initExitIntentTracking();
    }

    // Start immediately
    init();

    // Expose variant getter for debugging
    window.getABVariant = function() {
        const variant = getOrAssignVariant();
        return {
            variant: variant,
            headline: AB_TEST_CONFIG.variants[variant],
            testName: AB_TEST_CONFIG.testName
        };
    };

})();
