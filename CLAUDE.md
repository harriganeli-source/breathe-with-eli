## Tech Stack
- **Static HTML/CSS/JS** (no framework - not Next.js, React, etc.)
- **Hosting**: Vercel with auto-deploy on merge to main
- **Forms**: ConvertKit (Kit) for email signups

## Key Files
- **Stylesheet**: `css/styles.css` (main styles, ~2300 lines)
- **JavaScript**: `js/main.js` (navigation, animations, mandalas)
- **JavaScript**: `js/events.js` (dynamic event card rendering from JSON)
- **Event Data**: `data/events.json` (single source of truth for all events)
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
| `admin.html` | Event management admin panel (hidden, not in nav) |

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

## Event Management System

**Events are managed via `data/events.json`** — the single source of truth. Event cards on these 4 pages are rendered dynamically by `js/events.js`:
- `upcoming.html`, `index.html`, `book.html`, `work-with-me.html`

**To update events:**
1. Go to `/admin` to open the admin panel
2. Add, edit, delete, or reorder events using the UI
3. Click "Download events.json" to export the updated file
4. Replace `data/events.json` in the project with the downloaded file
5. Commit and push — Vercel auto-deploys

**Or** edit `data/events.json` directly — changes auto-propagate to all 4 pages.

**Individual event detail pages** (`valentines.html`, `mens-weekend.html`, `mensgroup.html`) are standalone HTML and must be updated manually when their details change.

## Content Sync Requirements

1. **Booking Cards** - The investment/booking cards must match across:
   - `book.html` (booking-options cards)
   - `work-with-me.html` (Investment section cards)
   - Same order: Virtual Consultation, Private Breathwork, Coaching Session
   - Same names, prices, durations, and descriptions
