# Archived Oct 4 2026: coaching and men's work

Eli decided the site is breathwork only (a trusted coach: 'coaching is dead' as a brand word). Men's work pages taken down; bios keep somatic/men's work/coaching by his call.

Full pre-change site: git tag `archive/coaching-and-mens-work-2026-10-04`.
Pages moved here (not deployed, see .vercelignore): mensgroup.html, mens-weekend.html, onlinemen.html. Old URLs redirect to /work-with-me (temporary redirects, in vercel.json).

## Removed blocks

### index.html: Offerings section

```html
    <!-- Services Section -->
    <section class="services">
        <div class="container">
            <h2 class="section-title">Offerings</h2>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <!-- Expanding circles / breath icon -->
                            <circle cx="12" cy="12" r="3"/>
                            <circle cx="12" cy="12" r="7"/>
                            <circle cx="12" cy="12" r="11"/>
                        </svg>
                    </div>
                    <h3>Dynamic Breathwork</h3>
                    <p>Somatic therapy. Unwind chronic bracing patterns in the body with a conscious connected breath.</p>
                    <a href="work-with-me.html#breathwork" class="link-arrow">Breathe!</a>
                </div>
                <div class="service-card">
                    <div class="service-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <!-- Heart icon -->
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    </div>
                    <h3>Men's Groups</h3>
                    <p>Join a group of conscious men for reflection, accountability & growth.</p>
                    <a href="work-with-me.html#mens-groups" class="link-arrow">Explore Current Offerings</a>
                </div>
            </div>
        </div>
    </section>

```

### work-with-me.html: Men's Groups section

```html
    <!-- Men's Groups Section -->
    <section id="mens-groups" class="content-section">
        <div class="container">
            <div class="two-col">
                <div>
                    <h2>Men's Groups</h2>
                    <p>There's something uniquely powerful about men coming together in authentic community.</p>
                    <p>Most of us were never taught how to do this. We learned to handle things alone, to push through, to compartmentalize. But we cannot bear life's burdens in isolation and still show up as the men we want to be.</p>
                    <p>In group, we create space for real conversation, mutual support, and the kind of honest reflection that's hard to find elsewhere. We witness each other, hold each other accountable, and work with the parts of ourselves we'd rather not look at: the shadow material that runs our lives when left unexamined.</p>
                    <p>Everything is invited. This is a space to bring your full self.</p>
                    <p>The work is not always comfortable. We challenge each other. We push each other toward growth. And in becoming more whole, we cultivate inner power: the kind that makes you grounded, clear, connected, and fully alive.</p>
                    <p>Groups may include breathwork, somatic exercises, facilitated discussion, and presence practices.</p>

                    <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Current Offerings</h3>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="mensgroup.html" class="btn btn-secondary">The Present Man Project</a>
                        <a href="mens-weekend.html" class="btn btn-secondary">Men's Weekend Workshop</a>
                    </div>
                </div>
                <div class="about-image">
                    <img src="images/campfire.webp" alt="Men gathered around a campfire">
                </div>
            </div>
        </div>
    </section>

```

### contact.html: form option

```html
                                    <option value="groups">Men's Groups</option>

```

### data/events.json: entries

```html
[
  {
    "id": "mens-weekend-2025-03-27",
    "title": "Men’s Weekend Workshop",
    "month": "Mar",
    "day": "27",
    "endDate": "to 29",
    "dateTimeDisplay": "Friday-Sunday, March 27-29",
    "location": "Victor, NY",
    "description": "Somatics, movement, emotional processing, breathwork, fire circle. Real challenge & connection. No bullshit.",
    "buttonText": "More Info",
    "buttonLink": "mens-weekend.html",
    "isExternal": false
  },
  {
    "id": "present-man-2025-04-07",
    "title": "The Present Man Project",
    "month": "Apr",
    "day": "7",
    "endDate": "to Jun 30",
    "dateTimeDisplay": "Ongoing Men’s Group · 7:00 PM - 9:30 PM Tuesdays",
    "location": "Victor, NY",
    "description": "Next cohort dates: April 7th, 21st · May 5th, 19th · June 2nd, 16th, 30th",
    "buttonText": "More Info",
    "buttonLink": "mensgroup.html",
    "isExternal": false
  }
]
```
