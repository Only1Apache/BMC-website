BMC — Role-enforced posting

Includes
- index.html with Identity login, role-gated UI, secure posting (JWT -> function)
- netlify/functions/get-posts.js (reads posts; needs NETLIFY_TOKEN (Forms: Read) + WEB_ID)
- netlify/functions/submit-post.js (enforces roles; proxies to site to create submission)
- netlify.toml + _redirects

Setup
1) Netlify Identity: enable; add role `official` (or `admin`) to allowed users.
2) Env vars:
   - NETLIFY_TOKEN: Personal Access Token with Forms: Read (for get-posts)
   - WEB_ID (or SITE_ID): Site API ID (for get-posts)
3) Deploy. Test:
   - /.netlify/functions/get-posts -> JSON
   - Log in as official, create a post on #members.
