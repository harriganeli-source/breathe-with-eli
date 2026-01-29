## Tech Stack
- **Static HTML/CSS/JS** (no framework - not Next.js, React, etc.)
- **Hosting**: Vercel with auto-deploy on merge to main
- **Forms**: ConvertKit (Kit) for email signups

## Key Files
- **Stylesheet**: `css/styles.css` (main styles, ~2300 lines)
- **JavaScript**: `js/main.js` (navigation, animations, mandalas)
- **Images**: `images/` directory

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Homepage with interactive mandala |
| `about.html` | Bio, story, testimonials |
| `work-with-me.html` | Services (breathwork, coaching, men's groups) |
| `upcoming.html` | Events & workshops calendar |
| `book.html` | Booking/scheduling |
| `contact.html` | Contact form |
| `mensgroup.html` | "The Present Man Project" |
| `valentines.html` | "The Inner Beloved" couples workshop |
| `for-teams.html` | Corporate/team offerings |

## Design System
**Colors:**
- Primary (sage green): `#4a5d4a`
- Secondary (warm brown): `#8b7355`
- Accent (soft gold): `#c4a77d`
- Text: `#2d2d2d`
- Background: `#faf9f7`

**Fonts:**
- Headings: Cormorant Garamond (serif)
- Body: Inter (sans-serif)

---

## Git Workflow (CRITICAL)

**Always follow this workflow before making ANY file changes:**
1. Run `git pull origin main` to get the latest code
2. Create a feature branch: `git checkout -b feature/description`
3. Make changes and commit
4. Push branch and create PR - never push directly to main
5. Do NOT run `vercel --prod` - Vercel auto-deploys on merge

This prevents overwriting changes that were merged via GitHub.

## Copy/Content Policy

**Never edit website copy without permission.** Before making any changes to text content (paragraphs, headings, testimonials, FAQ answers, descriptions, etc.):
1. Show the exact change you intend to make (before and after)
2. Ask for explicit permission before making the edit
3. Only proceed after receiving approval

This applies to all content on the site - always preserve the original copy from breathewitheli.com unless explicitly asked to change it.

## Content Sync Requirements (CRITICAL)

**When ANY event is added, changed, or removed, update ALL locations where it appears:**

1. **Upcoming Events** - These three pages must have identical event listings:
   - `upcoming.html` (primary source - Groups & Workshops page)
   - `book.html` (Upcoming Events section)
   - `work-with-me.html` (Upcoming Events section at bottom)

   **Sync these details for each event:**
   - Event name
   - Day of week, date, and time
   - Location
   - Description text
   - Registration/info links

2. **Individual Event Pages** - Must match the event listings above:
   - `valentines.html` - The Inner Beloved workshop details
   - `mens-weekend.html` - Men's Weekend Workshop details
   - `mensgroup.html` - The Present Man Project details

   When dates, times, or details change on an individual event page, update the corresponding event card on all three listing pages (and vice versa).

3. **Booking Cards** - The investment/booking cards must match across:
   - `book.html` (booking-options cards)
   - `work-with-me.html` (Investment section cards)
   - Same order: Virtual Consultation, Private Breathwork, Coaching Session
   - Same names, prices, durations, and descriptions
