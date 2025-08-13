BMC — Full working site

Includes:
- Home (Latest + Community posts feed)
- Explore Worlds page + community-submitted worlds (members only to publish)
- Members page with login, post, edit/delete (owner or admin)
- Netlify Functions: get-posts, submit-post, delete-post, update-post

Setup:
1) In Netlify site env vars:
   - NETLIFY_TOKEN: Personal Access Token (Sites: read, Forms: read, Submissions: read/delete)
   - WEB_ID (or SITE_ID): your Netlify Site ID
2) Enable Identity + roles (admin, member). Invite your account and assign role.
3) Deploy from Git or drag-and-drop this folder.


---

## Post World Button & Modal
- A "Post World" button now appears between the Worlds page header and the BMC Worlds panel.
- This button is only visible to logged-in Members (enabled) and Admins (disabled with tooltip), hidden for guests.
- Clicking the button opens a modal containing the "Submit a New World" form, cloned from the hidden panel in the DOM.
- The original inline panel remains in the HTML for reference but is hidden via `display:none`.
- CSS ensures the button is responsive (full width on narrow screens).
- Modal submit behavior remains unchanged and handled by `submit-post.js`.

To modify placement or behavior:
- Edit the toolbar markup injected after `<section id="page-worlds">` in `index.html`.
- Adjust the JS at the bottom of the file to change how the modal content is populated.



---

## Submit New World Button & Modal
- Added a **Submit New World** button between the Worlds page header and the BMC Worlds panel.
- This button is only visible to logged-in Members (enabled) and Admins (disabled with tooltip), hidden for guests.
- Clicking the button opens a modal containing the hidden "Submit a New World" form.
- The original inline panel is still in the HTML but hidden via `display:none`.
- The form submission is handled by the same existing scripts (`submit-post.js`).
- Button is responsive and spans full width on small screens.



---
## Submit New World (Modal Flow)
- The inline "Submit a New World" panel is kept in the HTML but permanently hidden via CSS.
- A **Submit New World** button appears below the Worlds page title. Clicking it opens a modal that clones the hidden panel content.
- The modal form submits through the existing `/.netlify/functions/submit-post` function with `category: "world_entry"`. Backend still enforces role rules (Members only). 
- To change placement, search for `#worlds-actions-top` in `index.html`. To tweak modal wiring, look for the comment `Submit New World: open modal and wire handlers` near the bottom of the main script.


---
## Worlds Modal Entry (Submit New World)
- Inline `#world-entry-panel` remains as a hidden template.
- Button `#open-world-modal` (text: "Submit New World") sits under the Worlds header.
- The modal clones that template and submits via `/.netlify/functions/submit-post` (Members-only enforced by backend).
- Edit locations: CSS rule near </style>, toolbar markup `#worlds-actions-top`, JS block named "Submit New World modal (safe & scoped)".
