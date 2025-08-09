BMC — Roles with Badges (admin/member)

What’s new
- Visual role badges: header chip + badge per post.
- Server stores the poster’s primary role; get-posts returns it.

Includes
- index.html (Identity login, admin/member UI gate, role chip, badge render)
- netlify/functions/submit-post.js (role check + saves role field in submission)
- netlify/functions/get-posts.js (returns role with items)
- netlify.toml + _redirects

Setup
1) Netlify Identity: add users with roles `admin` or `member`.
2) Env vars (for get-posts):
   - NETLIFY_TOKEN (Forms: Read)
   - WEB_ID or SITE_ID (Site API ID)
3) Deploy and test on /#members.
