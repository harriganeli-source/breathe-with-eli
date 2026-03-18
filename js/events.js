// ============================================
// BREATHE WITH ELI - Dynamic Event Rendering
// ============================================
// Fetches events from data/events.json and renders
// event cards into any container with data-events="true"

(async function() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to load events');
        const data = await response.json();

        const containers = document.querySelectorAll('[data-events="true"]');
        if (containers.length === 0) return;

        containers.forEach(function(container) {
            container.innerHTML = '';

            data.events.forEach(function(event) {
                var card = document.createElement('div');
                card.className = 'event-card';

                // Build event-date section
                var dateHTML = '<div class="event-date">' +
                    '<span class="month">' + event.month + '</span>' +
                    '<span class="day">' + event.day + '</span>';

                if (event.endDate) {
                    dateHTML += '<span style="font-size: 0.7rem; color: var(--color-text-light);">' + event.endDate + '</span>';
                }

                dateHTML += '</div>';

                // Build event-info section
                var titleHTML = event.soldOut
                    ? '<h3 style="text-decoration: line-through; opacity: 0.5;">' + event.title + '</h3>'
                    : '<h3>' + event.title + '</h3>';

                var infoHTML = '<div class="event-info">' +
                    titleHTML +
                    '<p><strong>' + event.dateTimeDisplay + '</strong> \u00b7 ' + event.location + '</p>' +
                    '<p>' + event.description + '</p>' +
                    '</div>';

                // Build button
                var buttonHTML;
                if (event.soldOut) {
                    var waitlistURL = 'contact.html?subject=waitlist&event=' + encodeURIComponent(event.title);
                    buttonHTML = '<a href="' + waitlistURL + '" class="btn btn-secondary">Join Waitlist</a>';
                } else if (event.isExternal) {
                    buttonHTML = '<a href="' + event.buttonLink + '" class="btn btn-secondary" target="_blank" rel="noopener">' + event.buttonText + '</a>';
                } else {
                    buttonHTML = '<a href="' + event.buttonLink + '" class="btn btn-secondary">' + event.buttonText + '</a>';
                }

                card.innerHTML = dateHTML + infoHTML + buttonHTML;
                container.appendChild(card);
            });
        });

        // Re-apply fade-in animations to dynamically rendered cards
        if (typeof window.observeFadeIns === 'function') {
            window.observeFadeIns();
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        // Show fallback message in containers
        var containers = document.querySelectorAll('[data-events="true"]');
        containers.forEach(function(container) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 2rem;">Check back soon for upcoming events.</p>';
        });
    }
})();
